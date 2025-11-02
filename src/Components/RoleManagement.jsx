import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { contractAbi, contractAddress } from '../Constant/constant';
import { getTranslation } from '../utils/translations';
import './RoleManagement.css';

const RoleManagement = ({ language, account }) => {
    const [userRole, setUserRole] = useState(0); // 0: None, 1: Admin, 2: Auditor, 3: Voter
    const [newUserAddress, setNewUserAddress] = useState('');
    const [selectedRole, setSelectedRole] = useState(3); // Default to Voter
    const [isLoading, setIsLoading] = useState(false);

    const roleNames = {
        0: 'None',
        1: 'Admin',
        2: 'Auditor', 
        3: 'Voter'
    };

    useEffect(() => {
        checkUserRole();
    }, [account]);

    const checkUserRole = async () => {
        try {
            if (!window.ethereum || !account) return;
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractAbi, provider);
            
            const role = await contract.getUserRole(account);
            setUserRole(role);
        } catch (error) {
            console.error('Error checking user role:', error);
        }
    };

    const assignRole = async () => {
        if (!ethers.utils.isAddress(newUserAddress)) {
            alert('Invalid Ethereum address');
            return;
        }

        setIsLoading(true);
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractAbi, signer);

            const tx = await contract.assignRole(newUserAddress, selectedRole);
            await tx.wait();
            
            alert(`Role ${roleNames[selectedRole]} assigned successfully!`);
            setNewUserAddress('');
        } catch (error) {
            console.error('Error assigning role:', error);
            alert('Error assigning role: ' + error.message);
        }
        setIsLoading(false);
    };

    if (userRole !== 1) { // Not Admin
        return (
            <div className="role-management-container">
                <div className="access-denied">
                    <h3>🚫 Access Denied</h3>
                    <p>Admin privileges required to manage roles.</p>
                    <p>Your current role: <strong>{roleNames[userRole]}</strong></p>
                </div>
            </div>
        );
    }

    return (
        <div className="role-management-container">
            <div className="role-header">
                <h2>👥 Role Management</h2>
                <p>Assign roles to users for Election Commission governance</p>
                <div className="current-role">
                    Your Role: <span className="role-badge admin">{roleNames[userRole]}</span>
                </div>
            </div>

            <div className="role-assignment-form">
                <h3>Assign New Role</h3>
                
                <div className="form-group">
                    <label>User Wallet Address:</label>
                    <input
                        type="text"
                        value={newUserAddress}
                        onChange={(e) => setNewUserAddress(e.target.value)}
                        placeholder="0x..."
                        className="address-input"
                    />
                </div>

                <div className="form-group">
                    <label>Select Role:</label>
                    <select 
                        value={selectedRole} 
                        onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                        className="role-select"
                    >
                        <option value={1}>🎖️ Admin - Full system control</option>
                        <option value={2}>🔍 Auditor - View and audit access</option>
                        <option value={3}>🗳️ Voter - Voting access</option>
                    </select>
                </div>

                <button 
                    onClick={assignRole}
                    disabled={isLoading || !newUserAddress}
                    className="assign-role-btn"
                >
                    {isLoading ? 'Assigning...' : 'Assign Role'}
                </button>
            </div>

            <div className="role-info">
                <h3>Role Permissions</h3>
                <div className="role-cards">
                    <div className="role-card admin">
                        <h4>🎖️ Admin</h4>
                        <ul>
                            <li>Manage voter registrations</li>
                            <li>Start/end elections</li>
                            <li>Add candidates</li>
                            <li>Assign roles</li>
                            <li>Access all analytics</li>
                        </ul>
                    </div>
                    
                    <div className="role-card auditor">
                        <h4>🔍 Auditor</h4>
                        <ul>
                            <li>View blockchain transactions</li>
                            <li>Generate audit reports</li>
                            <li>Export verification data</li>
                            <li>Monitor vote integrity</li>
                        </ul>
                    </div>
                    
                    <div className="role-card voter">
                        <h4>🗳️ Voter</h4>
                        <ul>
                            <li>Authenticate with Aadhaar</li>
                            <li>Cast one vote</li>
                            <li>View live results</li>
                            <li>Download vote receipt</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;