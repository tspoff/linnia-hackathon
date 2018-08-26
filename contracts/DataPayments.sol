pragma solidity ^0.4.24;

import "./math/SafeMath.sol";

contract DataPayments {

    using SafeMath for uint256;
    
    /** Contract Variables */
    struct PayoutGroup {
        mapping (uint256 => address) users;
        mapping (uint256 => uint256) weights;
        uint256 length;
        uint256 totalWeight;
    }
    
    mapping (address => uint256) private deposits; 
    mapping (address => PayoutGroup) public payoutGroups;
    mapping (address => bool) public hasPayoutGroup;
    address[] public buyers;
    
    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);
    event PayoutDistributed(address indexed buyer, uint256 weiAmount);
    
    /** Modifiers */
    modifier onlyRegisteredBuyers() {
        require(hasPayoutGroup[msg.sender]);
        _;
    }

    /** Functions */
    
    /**
    * @dev Registers the caller as a buyer
    * For now anyone can register, this could be expanded to have qualifications;
    */
    function registerAsBuyer() public {
        hasPayoutGroup[msg.sender] = true;
        buyers.push(msg.sender);
    }
     
    function setPayoutGroup(address[] _users, uint256[] _weights) public onlyRegisteredBuyers() {
        require(_users.length == _weights.length);
         
        hasPayoutGroup[msg.sender] = true;
    
        for (uint i = 0; i < _users.length; i++) {
            payoutGroups[msg.sender].users[i] = _users[i];
            payoutGroups[msg.sender].weights[i] = _weights[i];
            payoutGroups[msg.sender].totalWeight.add(_weights[i]);
        }
    
        payoutGroups[msg.sender].length = _users.length;
    }

    /**
    * @dev Deposits payments accourding to PayoutGroup
    * You have to be registered as a buyer to deposit funds
    */
    function depositPayout() public payable onlyRegisteredBuyers() {
        
        uint totalValue = msg.value;
        
        for (uint i = 0; i < payoutGroups[msg.sender].length; i++) {
            address user = payoutGroups[msg.sender].users[i];
            uint256 weight = payoutGroups[msg.sender].weights[i];
            
            _deposit(user, totalValue / weight);
        }
        
        emit PayoutDistributed(msg.sender, totalValue);
    }

    //
    function depositsOf(address _payee) public view returns (uint256) {
        return deposits[_payee];
    }
    
    /**
    * @dev Stores the sent amount as credit to be withdrawn.
    * @param _payee The destination address of the funds.
    */
    function _deposit(address _payee, uint256 _value) internal {
        deposits[_payee] = deposits[_payee].add(_value);
        emit Deposited(_payee, _value);
    }

/**
* @dev Withdraw accumulated balance for a payee.
*/
function withdraw() public {
    require(deposits[msg.sender] > 0);
    
    uint256 payment = deposits[msg.sender];
    assert(address(this).balance >= payment);
    deposits[msg.sender] = 0;
    emit Withdrawn(msg.sender, payment);
    
    msg.sender.transfer(payment);
    }
} 