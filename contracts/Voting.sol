// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;
    mapping(address => bool) public voters;
    mapping(address => string) public verifiedAadhaar; // Maps wallet to Aadhaar hash
    mapping(string => bool) public usedAadhaar; // Prevents duplicate Aadhaar usage

    uint256 public votingStart;
    uint256 public votingEnd;

constructor(string[] memory _candidateNames, uint256 _durationInMinutes) {
    for (uint256 i = 0; i < _candidateNames.length; i++) {
        candidates.push(Candidate({
            name: _candidateNames[i],
            voteCount: 0
        }));
    }
    owner = msg.sender;
    votingStart = block.timestamp;
    votingEnd = block.timestamp + (_durationInMinutes * 1 minutes);
}

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function addCandidate(string memory _name) public {
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
        require(!voters[msg.sender], "You have already voted.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");

        candidates[_candidateIndex].voteCount++;
        voters[msg.sender] = true;
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

    function extendVotingTime(uint256 _additionalMinutes) public onlyOwner {
        votingEnd = votingEnd + (_additionalMinutes * 1 minutes);
    }

    function resetVoting() public onlyOwner {
        for (uint256 i = 0; i < candidates.length; i++) {
            candidates[i].voteCount = 0;
        }
        votingStart = block.timestamp;
        votingEnd = block.timestamp + (90 * 1 minutes);
    }
}
