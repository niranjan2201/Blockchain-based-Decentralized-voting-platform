// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    enum Role { None, Admin, Auditor, Voter }
    
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;
    mapping(address => string) public verifiedAadhaar;
    mapping(string => bool) public usedAadhaar;
    mapping(address => Role) public userRoles;
    
    uint256 public votingStart;
    uint256 public votingEnd;
    
    event RoleAssigned(address indexed user, Role role);
    event VoteCast(address indexed voter, uint256 candidateIndex, uint256 timestamp);
    event ElectionStarted(uint256 startTime, uint256 endTime);
    event ElectionEnded(uint256 endTime);

constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
    userRoles[msg.sender] = Role.Admin;
    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
    
    emit RoleAssigned(msg.sender, Role.Admin);
    emit ElectionStarted(votingStart, votingEnd);
}

    modifier onlyAdmin {
        require(userRoles[msg.sender] == Role.Admin, "Admin access required");
        _;
    }
    
    modifier onlyAuditor {
        require(userRoles[msg.sender] == Role.Auditor || userRoles[msg.sender] == Role.Admin, "Auditor access required");
        _;
    }
    
    modifier onlyVoter {
        require(userRoles[msg.sender] == Role.Voter, "Voter registration required");
        _;
    }

    function assignRole(address _user, Role _role) public onlyAdmin {
        userRoles[_user] = _role;
        emit RoleAssigned(_user, _role);
    }
    
    function addCandidate(string memory _name) public onlyAdmin {
        candidates.push(Candidate({
                name: _name,
                voteCount: 0
        }));
    }

    function verifyAadhaar(string memory _aadhaarHash) public {
        require(bytes(verifiedAadhaar[msg.sender]).length == 0, "Aadhaar already verified for this wallet.");
        require(!usedAadhaar[_aadhaarHash], "This Aadhaar is already registered.");
        
        verifiedAadhaar[msg.sender] = _aadhaarHash;
        usedAadhaar[_aadhaarHash] = true;
    }

    function vote(uint256 _candidateIndex) public {
        require(_candidateIndex < candidates.length, "Invalid candidate index.");
        require(!voters[msg.sender], "You have already voted.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
        
        emit VoteCast(msg.sender, _candidateIndex, block.timestamp);
    }

    function isAadhaarVerified(address _voter) public view returns (bool) {
        return bytes(verifiedAadhaar[_voter]).length > 0;
    }

    function getAllVotesOfCandiates() public view returns (Candidate[] memory){
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
    }
        return votingEnd - block.timestamp;
    }

    function extendVotingTime(uint256 _additionalMinutes) public onlyAdmin {
        votingEnd = votingEnd + (_additionalMinutes * 1 minutes);
    }

    function endElection() public onlyAdmin {
        votingEnd = block.timestamp;
        emit ElectionEnded(block.timestamp);
    }

    function resetVoting() public onlyAdmin {
        for (uint256 i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (90 * 1 minutes);
        emit ElectionStarted(votingStart, votingEnd);
    }
    
    function getUserRole(address _user) public view returns (Role) {
        return userRoles[_user];
    }
    
    function getVoteEvents() public view onlyAuditor returns (bool) {
        return true; // Placeholder for event querying
    }
}
