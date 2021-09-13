declare const str = ''

declare module '*.css' {
  export default str
}
declare module '*.png' {
  export default str
}
declare module '*.jpg' {
  export default str
}
declare module '*.svg' {
  export default str
}
declare module '*.m4a' {
  export default str
}
declare module '*.mp4' {
  export default str
}
declare module '*.gif' {
  export default str
}

// set by webpack
declare var IS_TEST: boolean
declare var IS_DEV: boolean
declare var IS_CLI: boolean
declare var HASH: string
declare var ORIGIN_HOST: string
declare var ASSET_HOST: string
