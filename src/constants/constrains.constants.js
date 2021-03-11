export const ProposalConstraints = {
  '1': {
    type: 1,
    minStartTime: 60 * 60,
    maxStartTime: 60 * 60 * 24 * 30,
    minVotingDuration: 60 * 60 * 24 * 7,
    maxVotingDuration: 60 * 60 * 24 * 180,
    minTurnout: 55,
    minAgreement: 55,
  },
  '2': {
    type: 1,
    minStartTime: 60 * 60,
    maxStartTime: 60 * 60 * 24 * 30,
    minVotingDuration: 60 * 60 * 24 * 7,
    maxVotingDuration: 60 * 60 * 24 * 180,
    minTurnout: 60,
    minAgreement: 60,
  },
  '2': {
    type: 1,
    minStartTime: 60 * 60,
    maxStartTime: 60 * 60 * 24 * 30,
    minVotingDuration: 60 * 60 * 24 * 14,
    maxVotingDuration: 60 * 60 * 24 * 180,
    minTurnout: 55,
    minAgreement: 55,
  },
};
