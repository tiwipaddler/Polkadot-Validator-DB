# Polkadot Validator Dashboard

This project is a Polkadot validator dashboard built using TypeScript, React, and PAPI. The objecive is to help nominators

1. Identify which validators have received the most rewards to optimize their staking strategy.
2. Compare validator performance over time, as rewards vary by era.

## Features

## How To Choose a Validator: 
#### View detailed information for each validator, including:
  - **Total Stake** See how much is Staked with each Validator
  - **Validator Own Stake** See how much skin they have in the game
  - **Is it much?** % of own stake - Their own stake looks large until you can clearly see what percentage of it is in the total stake.
  - **Number of Nominator** See how many nominators they have. Can we assume each nominator is an independent person? No!
  - **Commission for Validators** How much commission do validator's charge for their effort?
  - **Era Reward Payout to Nominators** The Era Reward payout available to be split by the nominators after the validator has taken out their commission
  - **APY Earned by Nominators** The APY earned by validators that is not compounded.
  
- **APY Sorting**: The dashboard sorts validators based on their APY, making it easy to identify top-performing validators for that era. 

- **Real-time Data**: The dashboard fetches live data from the Polkadot network to ensure the information is up to the latest era that has already been rewarded. So this is set to ActiveEra - 1.

## Installation

To get started with the Polkadot Validator Dashboard, clone the repository and run the installations below
  
```bash
npm i polkadot-api
npx papi add dot -n polkadot
npm run dev
```
## Considerations
A significant amount of time was spent understanding the structure and functionality of PAPI to ensure accurate data retrieval from the Polkadot network. While the current dashboard implementation is functional, I intend to improve the user interface to better visualize the data across different eras.

## Future Improvements

If given more time, I would focus on the following improvements:

1. Enhancing the Average APY Metric: Currently, the dashboard provides a snapshot of APY for individual eras. I would like to further refine the calculation of an average APY over a series of eras, providing a more holistic view of validator performance over time.

2. Improving Visualizations: The dashboard could benefit from more advanced visualizations, particularly for displaying validator performance trends over time. Implementing interactive graphs or charts would allow nominators to track changes in performance more effectively.

3. Extending effort to include the project add-ons. This will be a personal project for me now. 

## Screenshot

Just in case it doesn't load your end, this is how it looks so far


<img width="1171" alt="Screenshot" src="https://github.com/user-attachments/assets/8e060ca1-4820-49dd-bdf9-594d80b77de0" />
