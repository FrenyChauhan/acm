import api from './api';

export const getEvents = (params = {}) =>
  api.get('/events', { params }).then(r => r.data.data);

export const getFlagshipEvents = () =>
  api.get('/events', { params: { flagship: true } }).then(r => r.data.data);

export const getEventBySlug = (slug) =>
  api.get(`/events/${slug}`).then(r => r.data.data);

export const getUpcomingEvents = () =>
  api.get('/events', { params: { upcoming: true } }).then(r => r.data.data);
