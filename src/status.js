/**
 * 安装中，子组件此时还拿不到dom
 */
export const mount = Symbol('mount')

/**
 * 准备入场，子组件应当为接下来的入场动画做准备
 * @type {symbol}
 */
export const enter = Symbol('enter')

/**
 * 入场中，子组件应当播放入场动画
 * @type {symbol}
 */
export const entering = Symbol('entering')

/**
 * 入场结束，子组件设置为最终状态
 * @type {symbol}
 */
export const entered = Symbol('entered')

/**
 * 准备退场，子组件应当为接下来的退场动画做准备
 * @type {symbol}
 */
export const exit = Symbol('exit')

/**
 * 退场中，子组件应当播放退场动画
 * @type {symbol}
 */
export const exiting = Symbol('exiting')

/**
 * 退场结束
 * @type {symbol}
 */
export const exited = Symbol('exited')