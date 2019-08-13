import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { action } from '@ember/object'

export default class ProblemRoute extends Route {
  async model(params) {
    const contest = await this.modelFor('contests.admission.contest').contest
    const contest_attempt = contest.get('currentAttempt')
    const problem = this.store.queryRecord('problem', {
      custom: {
        ext: 'url',
        url: `${params.problem_id}`
      },
      contest_id: contest.id,
      include: 'solution_stubs'
    })

    return RSVP.hash({
      contest,
      contest_attempt,
      problem
    })
  }

  setupController(controller, model) {
    controller.set('contest', model.contest)
    controller.set('contest_attempt', model.contest_attempt)
    controller.set('problem', model.problem)
  }

  @action
  error(err) {
    if (err.isAdapterError) {
      this.transitionTo('competitions.id.contest')
    }
  }
}
