/**
 * dsh-sidebar-guide-grid — host half.
 *
 * Deliberately empty: this plugin only restyles what the browser already draws
 * (the official right sidebar's 「开始」 guide page). The host half exists so the
 * profile bundle patch has a loader row to mount.
 */

/** Cordis plugin name; must match the loader row id in cordis.patch.yml. */
export const name = 'dsh-sidebar-guide-grid'

/** No host dependencies. */
export const inject = []

/** Mount nothing. */
export function apply() {}
