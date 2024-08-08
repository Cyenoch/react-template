declare global {
  export type FC<P = unknown> = (props: Readonly<{ children?: React.ReactNode, className?: string } & Readonly<P>>) => React.ReactElement | null
}

export {}
