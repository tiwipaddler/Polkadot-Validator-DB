export const formatDOT = (dotValue: bigint) =>
    (Number(dotValue) / 1e10).toLocaleString() + " DOT";