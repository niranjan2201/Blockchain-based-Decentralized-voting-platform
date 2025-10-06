import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import './App.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setremainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [CanVote, setCanVote] = useState(true);
  const [candidateName, setCandidateName] = useState('');


  useEffect( () => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return() => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  });


  async function vote() {
      if (!number || number === '') {
        alert('Please enter a candidate index');
        return;
      }
      
      if (parseInt(number) < 0 || parseInt(number) >= candidates.length) {
        alert('Invalid candidate index. Please enter a valid index from the table.');
        return;
      }
      
      try {
        if (!window.ethereum) {
          alert('MetaMask not detected');
          return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);
        
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress, contractAbi, signer
        );

        // Check if voting is still active
        const votingStatus = await contractInstance.getVotingStatus();
        if (!votingStatus) {
          alert('Voting period has ended');
          return;
        }

        const tx = await contractInstance.vote(parseInt(number), {
          gasLimit: 300000
        });
        console.log('Transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt);
        alert('Vote cast successfully!');
        
        canVote();
        getCandidates();
        setNumber('');
      } catch (error) {
        console.error('Voting error:', error);
        if (error.code === 4001) {
          alert('Transaction rejected by user');
        } else if (error.code === -32603) {
          alert('Network error. Please check your connection and try again.');
        } else if (error.message.includes('already voted')) {
          alert('You have already voted!');
        } else if (error.message.includes('Failed to fetch')) {
          alert('Network connection failed. Please check MetaMask network settings.');
        } else {
          alert('Error casting vote: ' + (error.reason || error.message));
        }
      }
  }


  async function canVote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(voteStatus);

  }

  async function getCandidates() {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract (
          contractAddress, contractAbi, signer
        );
        const candidatesList = await contractInstance.getAllVotesOfCandiates();
        const formattedCandidates = candidatesList.map((candidate, index) => {
          return {
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber()
          }
        });
        setCandidates(formattedCandidates);
      } catch (error) {
        console.error('Error getting candidates:', error);
      }
  }


  async function getCurrentStatus() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const status = await contractInstance.getVotingStatus();
      console.log(status);
      setVotingStatus(status);
  }

  async function getRemainingTime() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract (
        contractAddress, contractAbi, signer
      );
      const time = await contractInstance.getRemainingTime();
      setremainingTime(parseInt(time, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("Metamask Connected : " + address);
        setIsConnected(true);
        canVote();
      } catch (err) {
        console.error(err);
      }
    } else {
      console.error("Metamask is not detected in the browser")
    }
  }

  async function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  async function handleCandidateNameChange(e) {
    setCandidateName(e.target.value);
  }

  async function addCandidate() {
    if (!candidateName || candidateName.trim() === '') {
      alert('Please enter a candidate name');
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      const tx = await contractInstance.addCandidate(candidateName);
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');
      alert('Candidate added successfully!');
      setCandidateName('');
      getCandidates();
    } catch (error) {
      console.error('Add candidate error:', error);
      if (error.code === 4001) {
        alert('Transaction rejected by user');
      } else {
        alert('Error adding candidate: ' + error.message);
      }
    }
  }

  return (
    <div className="App">
      { votingStatus ? (isConnected ? (<Connected 
                      account = {account}
                      candidates = {candidates}
                      remainingTime = {remainingTime}
                      number= {number}
                      handleNumberChange = {handleNumberChange}
                      voteFunction = {vote}
                      showButton = {CanVote}
                      candidateName = {candidateName}
                      handleCandidateNameChange = {handleCandidateNameChange}
                      addCandidateFunction = {addCandidate}/>) 
                      
                      : 
                      
                      (<Login connectWallet = {connectToMetamask}/>)) : (<Finished />)}
      
    </div>
  );



}





export default App;
