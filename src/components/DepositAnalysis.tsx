import { analyzeDeposit } from '../utils'

interface IDepositAnalysis {
  amount: number
  depositPriceMin: number
  depositPriceMax: number
}

export const DepositAnalysis: React.FC<IDepositAnalysis> = ({
  amount,
  depositPriceMin,
  depositPriceMax,
}) => {
  if (!depositPriceMin || !depositPriceMax) return null

  const { percentText, isExpensive, clampedInRange } = analyzeDeposit(
    amount,
    depositPriceMin,
    depositPriceMax
  )

  // 텍스트 스타일 결정
  const percentColor = isExpensive ? 'text-red-500' : 'text-blue-500'
  const arrow = isExpensive ? '▲' : '▼'

  return (
    <div className="text-xs whitespace-normal">
      <span>최저가 대비 </span>
      <span className={`${percentColor} font-semibold`}>
        {percentText}% {arrow}
      </span>
      <span> / 전체 매물 상위 </span>
      <span className="font-semibold">{clampedInRange}%</span>
    </div>
  )
}
