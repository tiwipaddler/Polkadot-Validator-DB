import { DotQueries } from "@polkadot-api/descriptors";
import { typedApi } from "./chain";
import { SS58String } from "polkadot-api";
import Decimal from "decimal.js";

export type Validator = DotQueries["Session"]["Validators"]["Value"] extends SS58String[]
  ? { id: number; 
    address: SS58String;
    }
  : never;

export async function getValidators(): Promise<Validator[]> {
  const validatorAddresses = await typedApi.query.Session.Validators.getValue();

  if (!Array.isArray(validatorAddresses)) return [];

  return validatorAddresses.map((address, index) => ({
    id: index,
    address: address as SS58String,
  }));
}

///////////////////////////////////second column////////////////////////////

export type ErasRewardPoints = DotQueries["Staking"]["ErasRewardPoints"]["Value"] extends {
    individual: [SS58String, number][];
}
  ? { individual: { address: SS58String; points: number }[] }
  : never;

export async function getValidatorPoints(selectedEra: number): Promise<ErasRewardPoints> {
  const validatorPoints = await typedApi.query.Staking.ErasRewardPoints.getValue(selectedEra);

  if (!validatorPoints || !validatorPoints.individual) {
    return { individual: [] };
  }

  return {
      individual: validatorPoints.individual.map(([address, points]) => ({
      address: address as SS58String,
      points: points as number,
    })),
  };
}

//////////////// total points of selectedEra ////////////////
export type TotalPoints = DotQueries["Staking"]["ErasRewardPoints"]["Value"] extends {
  total: number;
}
  ? { total: number }
  : never;

export async function getTotalPoints(selectedEra: number): Promise<TotalPoints> {
  const totalPoints = await typedApi.query.Staking.ErasRewardPoints.getValue(selectedEra);

  if (!totalPoints || typeof totalPoints.total !== "number") {
    return { total: 0 }; // Default to 0 if total is not available
  }

  return { total: totalPoints.total };                                                                                 // (A) DONE
}

/////////////// total rewards of selectedEra ///////////////
export type TotalRewards = {
  totalRewards: number;
}

export async function getTotalRewards(selectedEra: number): Promise<TotalRewards> {
  const totalRewards = await typedApi.query.Staking.ErasValidatorReward.getValue(selectedEra);

  if (typeof totalRewards !== "bigint") {
    return { totalRewards: 0 };
  }

  return { totalRewards: Number(totalRewards) };                                                                       // (B) DONE 
}

//////////////// stake info: total,own, percentage, nominator count //////////////////
export type TotalStake = { 
  totalstake: number;
  ownstake: number;
  nominator_count: number;
  percentageownstake: number;
};

export async function getTotalStake(selectedEra: number, validatorAddress: SS58String): Promise<TotalStake> {
const stakeData = await typedApi.query.Staking.ErasStakersOverview.getValue(selectedEra, validatorAddress);

if (!stakeData) {
  return { totalstake: 0, ownstake: 0, nominator_count: 0, percentageownstake: 0 };
}

  const totalstake = Number(stakeData.total);
  const ownstake = Number(stakeData.own);
  const nominator_count = stakeData.nominator_count;

  const percentageownstake = totalstake > 0 
  ? new Decimal(ownstake).div(totalstake).mul(100).toNumber() 
  : 0;
                                                                                                                      // (D) DONE
  return { totalstake, ownstake, nominator_count, percentageownstake};                                                // (C) DONE
};

////////////// The Commission /////////////////////////////
export type commission = {
  commission: number;
}

export async function getValidatorCommission(selectedEra: number, validatorAddress: SS58String): Promise<number> {
  const commission = await typedApi.query.Staking.ErasValidatorPrefs.getValue(selectedEra, validatorAddress);

  if (!commission || typeof commission.commission !== "number") {
    return 0; 
  }

  return commission.commission;                                                                                        // (E) DONE
}


//////////////////Era///////////
export type activeera = {
  activeera: number;
}

export async function getActiveEra(): Promise<number> {
  const activeEra = await typedApi.query.Staking.ActiveEra.getValue();

  if (!activeEra || typeof activeEra.index !== "number") {
    return 0;
  }

  return activeEra.index;
}





