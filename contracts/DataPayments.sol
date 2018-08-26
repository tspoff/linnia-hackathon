pragma solidity ^0.4.24;

import "./math/SafeMath.sol";

/** Start */
contract DataPayments {
    /** Dependancies */
    using SafeMath for uint256;

    /** Smart Contract Variables */
    struct PayoutGroup {
        mapping (uint256 => address) users;
        mapping (uint256 => uint256) weights;
        uint256 length;
        uint256 totalWeight;
    }

    /** Smart Contract Mappings */
    mapping (address => uint256) private deposits;
    mapping (address => PayoutGroup) public payoutGroups;
    mapping (address => bool) public hasPayoutGroup;
    address[] public buyers;

    /** Smart Contract Events */
    event Deposited(address indexed payee, uint256 weiAmount);
    event Withdrawn(address indexed payee, uint256 weiAmount);
    event PayoutDistributed(address indexed buyer, uint256 weiAmount);

    /** Smart Contract Modifiers */
    modifier onlyRegisteredBuyers() {
        require(hasPayoutGroup[msg.sender]);
        _;
    }

    /** Start of Functions */
    /***********************/

    /**
    * @dev Registers the caller as a buyer
    * For now anyone can register, this would ideally be expanded to have qualifications
    */
    function registerAsBuyer() public {
        hasPayoutGroup[msg.sender] = true;
        buyers.push(msg.sender);
    }

    /**
    * @dev Gets users and the weight of each Users data and aggregates them into a Payout group
    * @param _users - Adresses of the Users to Pay payout
    * @param _weights - diversifies the value of each users' data in the Pay Out Group
    */
    function setPayoutGroup(address[] _users, uint256[] _weights) public onlyRegisteredBuyers() {
        require(_users.length == _weights.length);

        hasPayoutGroup[msg.sender] = true;

        //Assign the Users and Weights to the Payoutgroup
        for (uint i = 0; i < _users.length; i++) {
            payoutGroups[msg.sender].users[i] = _users[i];
            payoutGroups[msg.sender].weights[i] = _weights[i];

            uint totalWeight = payoutGroups[msg.sender].totalWeight;
            payoutGroups[msg.sender].totalWeight = totalWeight.add(_weights[i]);
        }

        payoutGroups[msg.sender].length = _users.length;
    }

    /**
    * @dev Deposits payments according to the values returned in PayoutGroup
    * You must be registered as a buyer to deposit funds
    */
    function depositPayout() public payable {

        require(msg.value > 0);

        uint256 totalWeight = payoutGroups[msg.sender].totalWeight;

        address user;
        uint256 weight;
        uint value;

        for (uint i = 0; i < payoutGroups[msg.sender].length; i++) {
            user = payoutGroups[msg.sender].users[i];
            weight = payoutGroups[msg.sender].weights[i];

            // Give each user a weighted proportion of the value
            // NOTE: This truncates presicion as there is no floating point math
            value = msg.value / totalWeight * weight;
            _deposit(user, value);
        }

        emit PayoutDistributed(msg.sender, msg.value);
    }

    /*
    * returns an unsigned int of the Payees deposit
    */
    function depositsOf(address _payee) public view returns (uint256) {
        return deposits[_payee];
    }

    /**
    * @dev Stores the sent amount as credit to be withdrawn.
    * @param _payee The destination address of the funds.
    */
    function _deposit(address _payee, uint256 _value) internal {
        uint256 deposit = deposits[_payee];
        deposits[_payee] = deposit.add(_value);
        emit Deposited(_payee, _value);
    }

/**
* @dev Withdraw accumulated balance of an individual Payee.
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
