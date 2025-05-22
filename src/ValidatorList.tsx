import { FC, useEffect, useState } from "react";
import Decimal from "decimal.js";
import { getActiveEra, getTotalPoints, getTotalRewards, getTotalStake, getValidatorCommission, getValidatorPoints, getValidators} from "./val.state";
import { SS58String } from "polkadot-api";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


//Arrange your shit
interface FullValidatorInfo {
  address: SS58String;
  totalstake: number;
  ownstake: number;
  nominator_count: number;
  percentageownstake: number;
  commission: number;
  eraReward: number;
  APY: number;
  // AvgAPY: number;
}

// Fetch and calculate validator stats
async function getAllValidatorStats(selectedEra: number, activeEra: number): Promise<FullValidatorInfo[]> {
  const validators = await getValidators();
  const points = await getValidatorPoints(selectedEra);
  const totalPoints = await getTotalPoints(selectedEra);
  const totalRewards = await getTotalRewards(selectedEra);

  const validatorData = await Promise.all(
    validators.map(async ({ address }) => {
      const stake = await getTotalStake(selectedEra, address);
      const commission = await getValidatorCommission(selectedEra, address);
      const commissionDecimal = new Decimal(commission).div(1_000_000_000);

      const validatorPoints = points.individual.find((v) => v.address === address)?.points || 0;

      const eraReward = new Decimal(validatorPoints)
        .div(new Decimal(totalPoints.total))
        .mul(new Decimal(totalRewards.totalRewards))
        .mul(new Decimal(1).minus(commissionDecimal));

      const APY = eraReward
        .div(new Decimal(stake.totalstake || 1))
        .mul(new Decimal(365))
        .mul(new Decimal(100));

      return {
        address,
        ...stake,
        commission,
        eraReward: eraReward.toNumber(),
        APY: APY.toNumber(),
      };
    })
  );

  return validatorData.sort((a, b) => b.APY - a.APY);
}

// ValidatorList component
interface ValidatorListProps {
  selectedEra: number;
  setSelectedEra: (era: number) => void;
}

export const ValidatorList: FC<ValidatorListProps> = ({ selectedEra, setSelectedEra }) => {
  const [validatorStats, setValidatorStats] = useState<FullValidatorInfo[] | null>(null);
  const [activeEra, setActiveEra] = useState<number | null>(null);

  useEffect(() => {
    const fetchEra = async () => {
      const era = await getActiveEra();
      setActiveEra(era);
    };
    fetchEra();
  }, []);

  useEffect(() => {
    if (selectedEra !== null && activeEra !== null) {
      const fetchValidatorStats = async () => {
        const stats = await getAllValidatorStats(selectedEra, activeEra);
        setValidatorStats(stats);
      };
      fetchValidatorStats();
    }
  }, [selectedEra, activeEra]);

  if (!validatorStats) {
    return <div className="text-center">Loading validator stats...</div>;
  }

  return (
    <div>
      {/* Era selection dropdown */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="era-select">Select Era:</label>
        <select
          id="era-select"
          className="border p-2"
          value={selectedEra ?? ""}
          onChange={(e) => setSelectedEra(Number(e.target.value))}
        >
          {activeEra !== null &&
            Array.from({ length: 84 }, (_, i) => {
              const era = activeEra - 1 - i;
              return (
                <option key={era} value={era}>
                  Era {era}
                </option>
              );
            })}
        </select>
      </div>

      {/* Table display */}
      <Table>
        <TableCaption>Validator Performance Overview</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Validator</TableHead>
            <TableHead>Total Stake</TableHead>
            <TableHead>Own Stake (%)</TableHead>
            <TableHead>Nominators</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Era Reward</TableHead>
            <TableHead className="text-right">APY</TableHead>
            {/* <TableHead className="text-right">AvgAPY</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {validatorStats.map((validator) => (
            <TableRow key={validator.address}>
              <TableCell className="font-medium">{validator.address}</TableCell>
              <TableCell>{validator.totalstake}</TableCell>
              <TableCell>{validator.percentageownstake.toFixed(2)}%</TableCell>
              <TableCell>{validator.nominator_count}</TableCell>
              <TableCell>{(validator.commission / 1_000_000_000 * 100).toFixed(2)}%</TableCell>
              <TableCell>{validator.eraReward.toFixed(0)}</TableCell>
              <TableCell className="text-right">{validator.APY.toFixed(2)}%</TableCell>                          
                                                                                                                 {/* ///// averge apy didnt work           */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ValidatorList;

