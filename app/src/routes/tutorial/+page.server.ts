import { tutorialLanding } from '#lib/server/tutorial-landing.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => tutorialLanding();
