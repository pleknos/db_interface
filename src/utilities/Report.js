import Postgres from 'utilities/Postgres'

export default class Report {
  constructor ({report, activities, period}) {
    this.report = report
    this.activities = activities.map(act => act.value && act.id).filter(act => act)
    this.period = period
    return this.createReport()
  }

  async createReport () {
    this.contargentsGroups = (await Postgres.select({place: 'public.contragents_groups', direction: 'ASC'}))
    let contents = await this.loadReportContents()
    let [wholeFact, wholePlan, beforeFact, beforePlan] = await this.loadActivities()
    let reportObject = this.fillObject(wholeFact, wholePlan, beforeFact, beforePlan)

    for (let activity of this.activities) {
      let {amounts, data} = this.filterAndFill([wholeFact, wholePlan, beforeFact, beforePlan], 'activity_type',
        activity)

      let name = (await Postgres.select(
        {subject: 'name', place: 'public.activity_types', where: 'id = ' + activity}))[0].name

      reportObject[activity] = amounts
      reportObject[activity].name = name

      await this.fillContents(contents, 1, reportObject[activity], data)
    }

    return reportObject
  }

  async fillContents (contents, counter, reportObject, prevData) {
    if (contents[counter] === undefined) return false

    let tableCol = contents[counter]
    let table = contents[counter] + 's'

    const tableCols = await Postgres.select({place: 'public.' + table, direction: 'ASC'})

    for (let col of tableCols) {
      let {amounts, data} = this.filterAndFill(prevData, tableCol,
        col.id)

      if (amounts.fact === 0 && amounts.plan === 0 && amounts.factBefore === 0 && amounts.planBefore === 0) continue

      if (tableCol === 'contragent') {

        if (parseInt(col.group_id) !== 1) {
          for (let group of this.contargentsGroups) {
            if (col.group_id === group.id) {
              if (reportObject[group.id]) {
                reportObject[group.id].fact += amounts.fact
                reportObject[group.id].plan += amounts.plan
                reportObject[group.id].factBefore += amounts.factBefore
                reportObject[group.id].planBefore += amounts.planBefore
              } else {
                reportObject[group.id] = amounts
                reportObject[group.id].name = group.name
              }
              await this.fillContents(contents, counter + 1, reportObject[group.id], data)
            }
          }
        } else {
          reportObject[col.id + 10] = amounts
          reportObject[col.id + 10].name = col.name
          await this.fillContents(contents, counter + 1, reportObject[col.id + 10], data)
        }

      } else {
        reportObject[col.id] = amounts
        reportObject[col.id].name = col.name
        await this.fillContents(contents, counter + 1, reportObject[col.id], data)
      }
    }
  }

  filterAndFill (data, key, value) {
    let res = data.map(table => {
      return table.filter(row => { return row[key] === value})
    })
    return {amounts: this.fillObject(...res), data: res}
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