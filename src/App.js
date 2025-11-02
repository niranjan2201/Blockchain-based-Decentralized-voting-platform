import { useState, useEffect } from 'react';
import {ethers} from 'ethers';
import {contractAbi, contractAddress} from './Constant/constant';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import Dashboard from './Components/Dashboard';
import AuditTrail from './Components/AuditTrail';
import CandidateProfiles from './Components/CandidateProfiles';
import AadhaarVerification from './Components/AadhaarVerification';
import UnifiedAuth from './Components/UnifiedAuth';
import RoleManagement from './Components/RoleManagement';
import RoleSelection from './Components/RoleSelection';
import AdminLogin from './Components/AdminLogin';
import AdminDashboard from './Components/AdminDashboard';
import VoteReceipt from './Components/VoteReceipt';
import ThemeLanguageControls from './Components/ThemeLanguageControls';
import { getTranslation } from './utils/translations';
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
  const [candidateParty, setCandidateParty] = useState('');
  const [candidateAge, setCandidateAge] = useState('');
  const [candidateEducation, setCandidateEducation] = useState('');
  const [candidateExperience, setCandidateExperience] = useState('');
  const [candidateSymbol, setCandidateSymbol] = useState('');
  const [activeTab, setActiveTab] = useState('voting');
  const [totalVoters] = useState(1000); // Mock total registered voters
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [voterData, setVoterData] = useState(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [voteReceiptData, setVoteReceiptData] = useState(null);
  const [authMethod, setAuthMethod] = useState(null); // 'aadhaar', 'wallet', null
  const [selectedRole, setSelectedRole] = useState(null); // 'voter', 'admin', 'auditor'
  const [userType, setUserType] = useState(null); // Current logged in user type
  const [showRoleSelection, setShowRoleSelection] = useState(true);


  useEffect( () => {
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    // Auto-refresh candidates every 3 seconds
    const interval = setInterval(() => {
      getCandidates();
      getRemainingTime();
      getCurrentStatus();
    }, 3000);

    return() => {
      clearInterval(interval);
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    }
  }, []);

  useEffect(() => {
    document.body.className = `${theme}-theme`;
  }, [theme]);


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
        const signer = provider.getSigner();
        const contractInstance = new ethers.Contract(
          contractAddress, contractAbi, signer
        );

        const tx = await contractInstance.vote(parseInt(number), {
          gasLimit: 100000
        });
        
        const receipt = await tx.wait();
        alert('Vote cast successfully!');
        
        generateVoteReceipt(parseInt(number), tx.hash, receipt.blockNumber);
        canVote();
        getCandidates();
        setNumber('');
      } catch (error) {
        console.error('Voting error:', error);
        if (error.message.includes('already voted')) {
          alert('You have already voted!');
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
        console.log('Fetching candidates...');
        if (!window.ethereum) {
          console.log('MetaMask not found');
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        console.log('Contract address:', contractAddress);
        const contractInstance = new ethers.Contract (
          contractAddress, contractAbi, signer
        );
        console.log('Calling getAllVotesOfCandiates...');
        const candidatesList = await contractInstance.getAllVotesOfCandiates();
        console.log('Raw candidates data:', candidatesList);
        const formattedCandidates = candidatesList.map((candidate, index) => {
          return {
            index: index,
            name: candidate.name,
            voteCount: candidate.voteCount.toNumber()
          }
        });
        console.log('Formatted candidates:', formattedCandidates);
        setCandidates(formattedCandidates);
      } catch (error) {
        console.error('Error getting candidates:', error);
        // Fallback to mock data for testing
        const mockCandidates = [
          { index: 0, name: 'Mark', voteCount: 0 },
          { index: 1, name: 'Mike', voteCount: 0 },
          { index: 2, name: 'Henry', voteCount: 0 },
          { index: 3, name: 'Rock', voteCount: 0 }
        ];
        console.log('Using mock candidates:', mockCandidates);
        setCandidates(mockCandidates);
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

  async function handleCandidatePartyChange(e) {
    setCandidateParty(e.target.value);
  }

  async function handleCandidateAgeChange(e) {
    setCandidateAge(e.target.value);
  }

  async function handleCandidateEducationChange(e) {
    setCandidateEducation(e.target.value);
  }

  async function handleCandidateExperienceChange(e) {
    setCandidateExperience(e.target.value);
  }

  async function handleCandidateSymbolChange(e) {
    setCandidateSymbol(e.target.value);
  }

  async function verifyAadhaarWithContract(aadhaarHash) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      const tx = await contractInstance.verifyAadhaar(aadhaarHash);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      return false;
    }
  }

  const handleUnifiedAuthSuccess = async (voterData, isAadhaarVerified) => {
    if (voterData && isAadhaarVerified) {
      // Hash the Aadhaar number for blockchain storage
      const aadhaarHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(voterData.aadhaarNumber));
      const verified = await verifyAadhaarWithContract(aadhaarHash);
      
      if (verified) {
        setVoterData(voterData);
        setIsAadhaarVerified(true);
        setAuthMethod('aadhaar');
      } else {
        alert('Failed to verify Aadhaar with blockchain');
        return;
      }
    } else {
      setAuthMethod('wallet');
    }
    setUserType('voter');
    setShowRoleSelection(false);
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'voter') {
      // Proceed to voter authentication (Aadhaar + MetaMask)
      setShowRoleSelection(false);
    } else {
      // Show admin/auditor login
      setShowRoleSelection(false);
    }
  };

  const handleAdminLoginSuccess = (userType) => {
    setUserType(userType);
    setIsConnected(true);
  };

  const handleLogout = () => {
    setUserType(null);
    setSelectedRole(null);
    setIsConnected(false);
    setIsAadhaarVerified(false);
    setVoterData(null);
    setAuthMethod(null);
    setShowRoleSelection(true);
  };

  const generateVoteReceipt = (candidateIndex, transactionHash, blockNumber) => {
    const candidate = candidates.find(c => c.index === candidateIndex);
    const receiptData = {
      voterName: voterData?.name || 'Verified Voter',
      aadhaarNumber: voterData?.aadhaarNumber || 'XXXX XXXX XXXX',
      walletAddress: account,
      candidateName: candidate?.name || 'Unknown',
      timestamp: new Date().toISOString(),
      transactionHash: transactionHash,
      blockNumber: blockNumber,
      receiptId: `VR${Date.now().toString().slice(-8)}`
    };
    setVoteReceiptData(receiptData);
    setShowReceipt(true);
  };

  async function addCandidate() {
    if (!candidateName || candidateName.trim() === '') {
      alert('Please enter a candidate name');
      return;
    }
    
    if (!candidateParty || candidateParty.trim() === '') {
      alert('Please enter party name');
      return;
    }
    
    if (!candidateAge || candidateAge < 25 || candidateAge > 80) {
      alert('Please enter valid age (25-80)');
      return;
    }
    
    if (!candidateEducation) {
      alert('Please select education level');
      return;
    }
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      
      // For now, we'll just add the candidate name to the contract
      // In a real implementation, you'd modify the smart contract to store additional data
      const tx = await contractInstance.addCandidate(candidateName);
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed');
      
      // Store additional candidate data locally (in a real app, this would be in a database)
      const candidateData = {
        name: candidateName,
        party: candidateParty,
        age: parseInt(candidateAge),
        education: candidateEducation,
        experience: parseInt(candidateExperience) || 0,
        symbol: candidateSymbol || '🏛️'
      };
      
      // Store in localStorage for demo purposes
      const existingCandidates = JSON.parse(localStorage.getItem('candidateProfiles') || '[]');
      existingCandidates.push(candidateData);
      localStorage.setItem('candidateProfiles', JSON.stringify(existingCandidates));
      
      alert('Candidate added successfully!');
      
      // Clear all form fields
      setCandidateName('');
      setCandidateParty('');
      setCandidateAge('');
      setCandidateEducation('');
      setCandidateExperience('');
      setCandidateSymbol('');
      
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

  const renderTabContent = () => {
    switch(activeTab) {
      case 'voting':
        return (
          <Connected 
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={vote}
            showButton={CanVote}
            candidateName={candidateName}
            handleCandidateNameChange={handleCandidateNameChange}
            candidateParty={candidateParty}
            handleCandidatePartyChange={handleCandidatePartyChange}
            candidateAge={candidateAge}
            handleCandidateAgeChange={handleCandidateAgeChange}
            candidateEducation={candidateEducation}
            handleCandidateEducationChange={handleCandidateEducationChange}
            candidateExperience={candidateExperience}
            handleCandidateExperienceChange={handleCandidateExperienceChange}
            candidateSymbol={candidateSymbol}
            handleCandidateSymbolChange={handleCandidateSymbolChange}
            addCandidateFunction={addCandidate}
            language={language}
          />
        );
      case 'profiles':
        return (
          <CandidateProfiles 
            language={language}
            candidates={candidates}
            voteFunction={vote}
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            candidates={candidates}
            totalVoters={totalVoters}
            votingStart={0}
            votingEnd={remainingTime}
            language={language}
          />
        );
      case 'audit':
        return <AuditTrail account={account} language={language} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <ThemeLanguageControls 
        theme={theme} 
        setTheme={setTheme} 
        language={language} 
        setLanguage={setLanguage} 
      />
      { votingStatus ? (
        // Admin/Auditor Dashboard
        (userType === 'admin' || userType === 'auditor') ? (
          <AdminDashboard 
            language={language}
            theme={theme}
            userType={userType}
            onLogout={handleLogout}
          />
        ) : 
        // Voter Dashboard
        isConnected && userType === 'voter' ? (
          <div>
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'voting' ? 'active' : ''}`}
                onClick={() => setActiveTab('voting')}
              >
                {getTranslation(language, 'votingPortal')}
              </button>
              <button 
                className={`nav-tab ${activeTab === 'profiles' ? 'active' : ''}`}
                onClick={() => setActiveTab('profiles')}
              >
                {getTranslation(language, 'candidateProfiles')}
              </button>
            </div>
            {renderTabContent()}
          </div>
        ) : 
        // Authentication Flow
        showRoleSelection ? (
          <RoleSelection 
            language={language}
            theme={theme}
            onRoleSelect={handleRoleSelect}
          />
        ) : selectedRole === 'voter' ? (
          <UnifiedAuth 
            language={language}
            theme={theme}
            onAuthSuccess={handleUnifiedAuthSuccess}
            connectWallet={connectToMetamask}
          />
        ) : (
          <AdminLogin 
            language={language}
            userType={selectedRole}
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={() => setShowRoleSelection(true)}
          />
        )
      ) : (
        <Finished language={language} />
      )}
    </div>
  );



}





export default App;
