"use server"

import { fetchUserContribution, getGithubClient } from "../../github/lib/github"

/* =========================
   CONTRIBUTION STATS
========================= */

export async function getContributionStats() {
  try {
    const { token } = await getGithubClient()

    const calendar = await fetchUserContribution(token)

    if (!calendar) return null

    const contributions = calendar.weeks.flatMap((week) =>
      week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: Math.min(4, Math.floor(day.contributionCount / 3)),
      }))
    )

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    }
  } catch (error) {
    console.error("Error fetching contribution stats:", error)
    return null
  }
}

/* =========================
   DASHBOARD SUMMARY
========================= */

export async function getDashboardStats() {
  try {
    const { octokit, user, token } = await getGithubClient()

    const [calendar, prs] = await Promise.all([
      fetchUserContribution(token),
      octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr`,
        per_page: 1,
      }),
    ])

    return {
      totalCommits: calendar?.totalContributions || 0,
      totalPRs: prs.data.total_count,
      totalReviews: 0, // Replace with DB logic
      totalRepos: 0,   // Replace with DB logic
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return {
      totalCommits: 0,
      totalPRs: 0,
      totalReviews: 0,
      totalRepos: 0,
    }
  }
}

/* =========================
   MONTHLY ACTIVITY (LAST 6 MONTHS)
========================= */

export async function getMonthlyActivity() {
  try {
    const { octokit, user, token } = await getGithubClient()

    const calendar = await fetchUserContribution(token)

    if (!calendar) return []

    const monthlyData: Record<
      string,
      { commits: number; prs: number; reviews: number }
    > = {}

    const now = new Date()

    // initialize last 6 months with YEAR-MONTH key
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`
      monthlyData[key] = { commits: 0, prs: 0, reviews: 0 }
    }

    // COUNT COMMITS
    calendar.weeks.forEach((week) => {
      week.contributionDays.forEach((day) => {
        const date = new Date(day.date)
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`
        if (monthlyData[key]) {
          monthlyData[key].commits += day.contributionCount
        }
      })
    })

    // COUNT PRs (last 6 months)
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const { data: prs } =
      await octokit.rest.search.issuesAndPullRequests({
        q: `author:${user.login} type:pr created:>${sixMonthsAgo
          .toISOString()
          .split("T")[0]}`,
        per_page: 100,
      })

    prs.items.forEach((pr) => {
      const date = new Date(pr.created_at)
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`
      if (monthlyData[key]) {
        monthlyData[key].prs += 1
      }
    })

    return Object.entries(monthlyData).map(([name, data]) => ({
      name,
      ...data,
    }))
  } catch (error) {
    console.error("Error fetching monthly activity:", error)
    return []
  }
}
