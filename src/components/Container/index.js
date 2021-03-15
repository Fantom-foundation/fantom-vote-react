import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethers } from 'ethers';

import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';
import Switch from '@material-ui/core/Switch';
import dateFormat from 'dateformat';

import WalletConnectActions from '../../actions/walletconnect.actions';
import { ProposalTemplateSC, PlainTextProposalSC } from '../../constants/contract.constants';

import './styles.css';
import FantomLogo from '../../assets/fantomlogo.svg';
import { Description } from '@material-ui/icons';
import { Input } from '@material-ui/core';

const Container = () => {
  const dispatch = useDispatch();

  const [whichProposal, setWhichProposal] = useState('plaintext');
  const [account, setAccount] = useState('');
  const [proposalName, setProposalName] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');
  const [minAgreement, setMinAgreement] = useState();
  const [minVotes, setMinVotes] = useState();
  const [options, setOptions] = useState();
  const [startTime, setStartTime] = useState();
  const [minEndTime, setMinEndTime] = useState();
  const [maxEndTime, setMaxEndTime] = useState();

  const [isTemplateShown, setIsTemplateShown] = useState(false);
  const [isConstraintsShown, setIsConstraintsShown] = useState(false);
  const now = new Date();
  const today = dateFormat(now, 'yyyy-mm-dd') + 'T' + dateFormat(now, 'HH:MM');

  let isConnected = useSelector(state => state.ConnectWallet.isConnected);
  let chainId = useSelector(state => state.ConnectWallet.chainId);

  const handleProposalTypeChange = event => {
    setWhichProposal(event.target.value);
  };

  const connectMetamask = async () => {
    await window.ethereum.enable();
    //   handle network change & disconnect here
    window.ethereum.on('chainChanged', _chainId => {
      //   handle chainId change
      dispatch(WalletConnectActions.changeChainId(_chainId));
      setAccount('');
      console.log('chainid is changed to ', _chainId);
    });
    window.ethereum.on('disconnect', error => {
      //   handle disconnect
      dispatch(WalletConnectActions.disconnectWallet());
      setAccount('');
      console.log('handler for disconnection', error);
    });
    window.ethereum.on('accountsChanged', accounts => {
      if (accounts.length == 0) {
        // handle when no account is connected
        dispatch(WalletConnectActions.disconnectWallet());
        console.log('disconnected');
      }
    });
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let chainId = (await provider.getNetwork()).chainId;
    let accounts = await provider.listAccounts();
    let account = accounts[0];
    setAccount(account);
    return account, chainId;
  };

  const loadContract = async (address, abi) => {
    await window.ethereum.enable();
    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let signer = provider.getSigner();
    return new ethers.Contract(address, abi, signer);
  };

  const handleWalletConnect = async () => {
    if (isConnected) {
      setAccount('');
      dispatch(WalletConnectActions.disconnectWallet());
      // handle disconnect here
    } else {
      // handle connect here
      let account,
        chainId = await connectMetamask();
      if (chainId != 4002) {
        console.log('not connected to Opera Network');
        dispatch(WalletConnectActions.connectWallet(chainId));
        createNotification('custom', 'You are not connected to Opera Network');
      } else {
        console.log('connected');
        dispatch(WalletConnectActions.connectWallet(chainId));
      }
    }
  };

  // constrains

  const constraints = [
    'execution type : Execution type when proposal gets resolved. Possible options: 0 = not executable, 1 = call, 2 = delegatecall.',
    'minVotes : Minimum allowed Minimum voting turnout.',
    'minAgreement : Minimum allowed Minimum voting agreement.',
    'opinionScales : Array of options. Each opinion scale defines an exact measure of agreement which voter may choose.',
    'minVotingDuration : Minimum duration of the voting.',
    'maxVotingDuration : Maximum duration of the voting.',
    'minStartDelay : Minimum delay of the voting (i.e. must start with a delay).',
    'maxStartDelay : Maximum delay of the voting (i.e. must start sooner).',
    'verifier : If defined, then ProposalTemplates calls this contract to verify the proposal. It may be used to extend proposal verification.',
  ];

  // tip table
  const StyledTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      paddingTop: '2px',
      paddingLeft: '3px',
      paddingBottom: '2px',
      paddingRight: '3px',
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles(theme => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  function createData(name, proposal, execution, minSD, maxSD, minVD, maxVD, minTurnout, minAgreement) {
    return { name, proposal, execution, minSD, maxSD, minVD, maxVD, minTurnout, minAgreement };
  }

  const rows = [
    createData(
      'Unknown non-executable',
      1,
      'Non-executable only',
      '1 hour',
      '30 days',
      '7 days',
      '180 days',
      '55%',
      '55%',
    ),
    createData(
      'Unknown call-executable	',
      2,
      'Call-executable only',
      '1 hour',
      '30 days',
      '7 days',
      '180 days',
      '60%',
      '60%',
    ),
    createData(
      'Unknown delegatecall-executable',
      3,
      'Delegatecall-executable only',
      '1 hour',
      '30 days',
      '14 days',
      '180 days',
      '55%',
      '55%',
    ),
  ];

  const createNotification = (type, message) => {
    switch (type) {
      case 'info':
        NotificationManager.info('Smart Contracts are loaded');
        break;
      case 'success':
        NotificationManager.success('Connected to Opera Network', 'Success');
        break;
      case 'proposalCreated':
        NotificationManager.success('Proposal successfully created', 'Success');
        break;
      case 'warning':
        NotificationManager.warning('Network Changed', 'Close after 3000ms', 3000);
        break;
      case 'disconnected':
        NotificationManager.warning('You need to connect to Opera Network first', 'Connect your Metamask', 3000);
        break;
      case 'error':
        NotificationManager.error('Failed', type, 5000, () => {
          // alert('callback');
        });
        break;
      case 'invalidInput':
        NotificationManager.warning(message + ' is invalid', 'Invalid Input', 3000, () => {
          // alert('callback');
        });
        break;
      case 'custom':
        NotificationManager.warning(message, '', 3000, () => {
          // alert('callback');
        });
        break;
    }
  };
  const formatAddress = addr => {
    return addr;
    if (addr && addr != '') return addr.substring(0, 4) + '....' + addr.substring(addr.length - 4);
    return addr || '';
  };

  const validateInputs = () => {
    let now = new Date();
    let _startTime = new Date(startTime);
    let _minEndTime = new Date(minEndTime);
    let _maxEndTime = new Date(maxEndTime);
    if (now >= _startTime) {
      createNotification('custom', 'Start Time must be later than now');
      return false;
    }
    if ((_startTime - now) / 1000 < 3600) {
      createNotification('custom', 'There must be at least 1 hour delay');
      return false;
    }
    if ((_minEndTime - _startTime) / 1000 < 3600 * 24 * 7) {
      createNotification('custom', 'Min Voting Duration is at least 7 days');
      return false;
    }
    if ((_maxEndTime - _startTime) / 1000 > 3600 * 24 * 180) {
      createNotification('custom', 'Max Voting Duration is at most 180 days');
      return false;
    }

    if (_minEndTime > _maxEndTime) {
      createNotification('custom', 'Max End time should be later than Min End time');
      return false;
    }

    if (!proposalName || proposalName == '') {
      createNotification('invalidInput', 'Proposal Name');
      return false;
    }
    if (!proposalDescription || proposalDescription == '') {
      createNotification('invalidInput', 'Proposal Description');
      return false;
    }
    if (minAgreement < 55) {
      createNotification('custom', 'Min Agreement should be higher than 55%');
      return false;
    }
    if (!minAgreement || minAgreement == '') {
      createNotification('invalidInput', 'Min Agreement');
      return false;
    }
    if (minVotes < 55) {
      createNotification('custom', 'Min Votes should be higher than 55%');
      return false;
    }
    if (!minVotes || minVotes == '') {
      createNotification('invalidInput', 'Min Votes');
      return false;
    }
    if (!options || options == '') {
      createNotification('invalidInput', ' Options');
      return false;
    }
    return true;
  };

  const handlePlainTextProposal = async (templateSC, plainTextProposalFactorySC) => {
    let isValidProposal = validateInputs();
    if (!isValidProposal) {
      return;
    }
    let now = new Date();

    let provider = new ethers.providers.Web3Provider(window.ethereum);
    let accounts = await provider.listAccounts();
    let account = accounts[0];

    console.log(
      proposalName,
      proposalDescription,
      options,
      ((minVotes * 10 ** 18) / 100).toString(),
      ((minAgreement * 10 ** 18) / 100).toString(),
      parseInt((startTime - now) / 1000),
      parseInt((minEndTime - now) / 1000),
      parseInt((maxEndTime - now) / 1000),
      { from: account, value: ethers.utils.parseEther('100.0') },
    );

    let result = await plainTextProposalFactorySC.create(
      proposalName,
      proposalDescription,
      options,
      ((minVotes * 10 ** 18) / 100).toString(),
      ((minAgreement * 10 ** 18) / 100).toString(),
      parseInt((startTime - now) / 1000),
      parseInt((minEndTime - now) / 1000),
      parseInt((maxEndTime - now) / 1000),
      { from: account, value: ethers.utils.parseEther('100.0') },
    );
    console.log(result);
    return result;
  };

  const handleSubmit = async () => {
    if (!isConnected) {
      // handle when not connected
      createNotification('disconnected');
    } else {
      if (chainId != 4002) {
        createNotification('custom', 'You need to connect to OperaNetwork first');
        return;
      }
      let templateSC = await loadContract(ProposalTemplateSC.testnetAddress, ProposalTemplateSC.abi);
      let plainTextProposalFactorySC = await loadContract(PlainTextProposalSC.testnetAddress, PlainTextProposalSC.abi);
      console.log(templateSC);
      console.log(plainTextProposalFactorySC);
      try {
        let result = await handlePlainTextProposal(templateSC, plainTextProposalFactorySC);
        if (result) createNotification('proposalCreated');
      } catch (error) {
        createNotification('custom', 'There has been an error in creating a proposal');
      }
    }
  };

  const IOSSwitch = withStyles(theme => ({
    root: {
      width: 42,
      height: 26,
      padding: 0,
      margin: theme.spacing(1),
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  }))(({ classes, ...props }) => {
    return (
      <Switch
        focusVisibleClassName={classes.focusVisible}
        disableRipple
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
        {...props}
      />
    );
  });
  return (
    <div className="container">
      <NotificationContainer />
      <div className="header">
        <img src={FantomLogo}></img>
        <div className="headerRight">
          <span className="toggleSpan">
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={isTemplateShown}
                  onChange={() => {
                    setIsTemplateShown(!isTemplateShown);
                  }}
                  name="checkedB"
                />
              }
              label="Template"
            />
          </span>
          <span className="toggleSpan">
            <FormControlLabel
              control={
                <IOSSwitch
                  checked={isConstraintsShown}
                  onChange={() => {
                    setIsConstraintsShown(!isConstraintsShown);
                  }}
                  name="checkedB"
                />
              }
              label="Constraint"
            />
          </span>
          <span className="walletConnect" onClick={handleWalletConnect}>
            {!isConnected ? 'Connect Wallet' : 'Disconnect'}
          </span>
        </div>
      </div>
      <div className="board">
        <div className="selector">
          <FormControl component="fieldset">
            <FormLabel component="legend" className="selectorLegend">
              Proposal Types
            </FormLabel>
            <RadioGroup
              aria-label="proposalType"
              name="proposalType"
              value={whichProposal}
              onChange={handleProposalTypeChange}
            >
              <FormControlLabel value="plaintext" control={<Radio />} label="PlainText" />
              <FormControlLabel value="deposit" disabled control={<Radio />} label="Deposit" />
              <FormControlLabel value="networkparameter" disabled control={<Radio />} label="Network Parameter" />
              <FormControlLabel value="slashingpenalty" disabled control={<Radio />} label="Slashing Penalty" />
              <FormControlLabel value="softwareupgrade" disabled control={<Radio />} label="Software Upgrade" />
            </RadioGroup>
          </FormControl>
        </div>
        <div className="proposalBoard">
          <div className="subboard1">
            <div className="proposal">
              <div className="proposalHeading">Create Your Proposal Here</div>
              <div className="proposalGridLow">
                <TextField
                  id="standard-basic"
                  label="Name"
                  value={proposalName}
                  onChange={e => {
                    setProposalName(e.target.value);
                  }}
                  className="proposalInput"
                />
                <TextField
                  id="standard-basic"
                  label="Address"
                  value={formatAddress(account)}
                  className="proposalInput"
                  inputProps={
                    {
                      // readOnly: true,
                    }
                  }
                />
                <TextField
                  id="standard-basic"
                  label="Start Time"
                  type="datetime-local"
                  defaultValue={today}
                  className="proposalInput"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => {
                    setStartTime(new Date(e.target.value));
                  }}
                />
              </div>
              <div className="proposalGridLow">
                <TextField
                  id="standard-basic"
                  label="Description"
                  value={proposalDescription}
                  onChange={e => {
                    setProposalDescription(e.target.value);
                  }}
                  className="proposalInput"
                />
                <TextField
                  id="standard-basic"
                  label="Min Agreement"
                  type="number"
                  value={minAgreement}
                  onChange={e => {
                    setMinAgreement(e.target.value);
                  }}
                  className="proposalInput"
                  placeholder="This should be greater than 55."
                  InputProps={{
                    inputProps: {
                      max: 100,
                      min: 55,
                    },
                  }}
                />
                <TextField
                  id="standard-basic"
                  label="Min End Time"
                  type="datetime-local"
                  defaultValue={today}
                  className="proposalInput"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => {
                    setMinEndTime(new Date(e.target.value));
                  }}
                />
              </div>
              <div className="proposalGridLow">
                <TextField
                  id="standard-basic"
                  label="OptionScales"
                  onChange={e => {
                    let value = e.target.value;
                    let values = value.split(',');
                    let _options = [];
                    values.map(val => {
                      _options.push(ethers.utils.formatBytes32String(val));
                    });
                    setOptions(_options);
                  }}
                  placeholder="Each options are separated by comma. eg: 1,2,3"
                  className="proposalInput"
                />
                <TextField
                  id="standard-basic"
                  label="Min Votes"
                  type="number"
                  value={minVotes}
                  onChange={e => {
                    setMinVotes(e.target.value);
                  }}
                  className="proposalInput"
                  placeholder="This should be greater than 55."
                  InputProps={{
                    inputProps: {
                      max: 100,
                      min: 55,
                    },
                  }}
                />

                <TextField
                  id="standard-basic"
                  label="Max End Time"
                  type="datetime-local"
                  defaultValue={today}
                  className="proposalInput"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={e => {
                    setMaxEndTime(new Date(e.target.value));
                  }}
                />
              </div>
              <div className={isTemplateShown ? 'smallButton' : 'bigButton'}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className="submitButton"
                  endIcon={<SendIcon></SendIcon>}
                >
                  Submit
                </Button>
              </div>
            </div>
            {isTemplateShown && (
              <div>
                <div className="proposalTemplateHeading">Fantom Proposal Templates</div>
                <div>
                  <TableContainer component={Paper}>
                    <Table className="tipTable" aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Name</StyledTableCell>
                          <StyledTableCell align="right">Proposal</StyledTableCell>
                          <StyledTableCell align="right">Execution</StyledTableCell>
                          <StyledTableCell align="right">MinStartTime</StyledTableCell>
                          <StyledTableCell align="right">MaxStartTime</StyledTableCell>
                          <StyledTableCell align="right">MinVotingDuration</StyledTableCell>
                          <StyledTableCell align="right">MaxVotingDuration</StyledTableCell>
                          <StyledTableCell align="right">MinTurnout</StyledTableCell>
                          <StyledTableCell align="right">MinAgreement</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <StyledTableRow key={row.name}>
                            <StyledTableCell>{row.name}</StyledTableCell>
                            <StyledTableCell align="right">{row.proposal}</StyledTableCell>
                            <StyledTableCell align="right">{row.execution}</StyledTableCell>
                            <StyledTableCell align="right">{row.minSD}</StyledTableCell>
                            <StyledTableCell align="right">{row.maxSD}</StyledTableCell>
                            <StyledTableCell align="right">{row.minVD}</StyledTableCell>
                            <StyledTableCell align="right">{row.maxVD}</StyledTableCell>
                            <StyledTableCell align="right">{row.minTurnout}</StyledTableCell>
                            <StyledTableCell align="right">{row.minAgreement}</StyledTableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            )}
          </div>
        </div>
        {isConstraintsShown && (
          <div className="quote-bg" onClick={() => setIsConstraintsShown(false)}>
            <div className="quote">
              <div className="proposalConstraintHeading">Proposal template constraints</div>

              <List component="nav" aria-label="contacts" className="constraintsList">
                {constraints.map(constraint => (
                  <ListItem button>
                    <ListItemIcon>
                      <StarIcon />
                    </ListItemIcon>
                    <ListItemText primary={constraint} />
                  </ListItem>
                ))}
              </List>
            </div>
          </div>
        )}
      </div>
      <div className="footer">
        <span>Powered By</span>
        <img src={FantomLogo} className="footerLogo"></img>
      </div>
    </div>
  );
};

export default Container;
