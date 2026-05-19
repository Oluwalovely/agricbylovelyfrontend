const rounded = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    full: 'rounded-full',
}

// Single skeleton bar
const SkeletonBar = ({ width = '100%', height = '16px', round = 'sm', className = '' }) => (
    <div
        className={`skeleton ${rounded[round]} ${className}`}
        style={{ width, height }}
    />
)

// Card skeleton — for loading crop cards, field cards etc
const SkeletonCard = () => (
    <div
        className="rounded-2xl border p-5 flex flex-col gap-3"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}
    >
        <SkeletonBar height="20px" width="60%" />
        <SkeletonBar height="14px" width="40%" />
        <SkeletonBar height="14px" />
        <SkeletonBar height="14px" width="80%" />
        <SkeletonBar height="8px" round="full" />
    </div>
)

// Stat card skeleton — for dashboard top stats
const SkeletonStat = () => (
    <div
        className="rounded-2xl border p-5 flex flex-col gap-3"
        style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)' }}
    >
        <SkeletonBar height="12px" width="50%" />
        <SkeletonBar height="32px" width="40%" />
        <SkeletonBar height="12px" width="60%" />
    </div>
)

// Table row skeleton
const SkeletonRow = () => (
    <div className="flex items-center gap-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <SkeletonBar height="36px" width="36px" round="full" />
        <div className="flex-1 flex flex-col gap-2">
            <SkeletonBar height="14px" width="40%" />
            <SkeletonBar height="12px" width="60%" />
        </div>
        <SkeletonBar height="24px" width="60px" round="full" />
    </div>
)

// Main export with count support
const Skeleton = ({ count = 1, type = 'bar', ...props }) => {
    if (type === 'card') return (
        <>{Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}</>
    )
    if (type === 'stat') return (
        <>{Array.from({ length: count }).map((_, i) => <SkeletonStat key={i} />)}</>
    )
    if (type === 'row') return (
        <>{Array.from({ length: count }).map((_, i) => <SkeletonRow key={i} />)}</>
    )
    return (
        <div className="flex flex-col gap-2">
            {Array.from({ length: count }).map((_, i) => <SkeletonBar key={i} {...props} />)}
        </div>
    )
}

export { SkeletonBar, SkeletonCard, SkeletonStat, SkeletonRow }
export default Skeleton