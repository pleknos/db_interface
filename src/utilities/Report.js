import Postgres from 'utilities/Postgres'

export default class Report {
  constructor ({report, activities, period}) {
    this.report = report
    this.activities = activities.map(act => act.value && act.id).filter(act => act)
    this.period = period
    this.createReport()
  }

  async createReport () {
    const contents = await this.loadReportContents()
    let [wholeFact, wholePlan, beforeFact, beforePlan] = await this.loadActivities()
    let reportObject = this.fillObject(wholeFact, wholePlan, beforeFact, beforePlan)

    this.activities.forEach(activity => {
      reportObject[activity] =
        this.filterAndFill([wholeFact, wholePlan, beforeFact, beforePlan], 'activity_type', activity)
    })

    console.log(reportObject)
  }

  filterAndFill (data, key, value) {
    let res = data.map(table => {
      return table.filter(row => { return row[key] === value})
    })
    return this.fillObject(...res)
  }

  fillObject (fact, plan, factBefore, planBefore) {
    const fill = obj => {
      return obj.reduce((prev, cur) => {
        return prev + parseInt(cur.amount)
      }, 0)
    }

    return {
      fact: fill(fact),
      plan: fill(plan),
      factBefore: fill(factBefore),
      planBefore: fill(planBefore),
    }
  }

  async loadActivities () {
    let whereString = `(transaction_date >= '${this.period.first}' AND transaction_date <= '${this.period.last}') AND (`
    let beforeString = `transaction_date < '${this.period.first}' AND (`

    let defString = this.activities.reduce((prev, current) => {
      return prev + `activity_type = ${current} OR `
    }, '').slice(0, -4) + ')'

    whereString += defString
    beforeString += defString

    let wholeFact = Postgres.select({place: 'public.transactions', where: whereString, direction: 'ASC'})
    let wholePlan = Postgres.select({place: 'public.planned', where: whereString, direction: 'ASC'})
    let beforeFact = Postgres.select({place: 'public.transactions', where: beforeString, direction: 'ASC'})
    let beforePlan = Postgres.select({place: 'public.planned', where: beforeString, direction: 'ASC'})

    return Promise.all([wholeFact, wholePlan, beforeFact, beforePlan])
  }

  async loadReportContents () {
    const reportContents = await Postgres.select(
      {subject: 'contents', place: 'private.reports', where: `name = '${this.report}'`})
    return Object.values(reportContents[0].contents)
  }
}