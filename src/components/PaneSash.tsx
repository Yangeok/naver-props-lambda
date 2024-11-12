interface IPaneSash {
  split: 'vertical' | 'horizontal'
}

/**
 * @deprecated
 */
export const PaneSash: React.FC<IPaneSash> = ({ split }) => {
  return (
    <div
      className={`flex items-center justify-center bg-gray-100 ${
        split === 'horizontal'
          ? 'cursor-row-resize h-2 w-full'
          : 'cursor-col-resize w-2 h-full'
      }`}
    >
      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
    </div>
  )
}
