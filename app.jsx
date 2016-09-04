var PLAYERS = [
	{
		name: "Iulia Lungu",
		score: 31,
		id: 1,
	},
	{
		name: "Ana Maria Stanescu",
		score: 35,
		id: 2,
	},
	{
		name: "Irina Iordanescu",
		score: 42,
		id: 3,
	},
];
var nextId = 4;

var AddPlayerForm = React.createClass({
	propTypes : {
		onAdd: React.PropTypes.func.isRequired
	},
	getInitialState :  function () {
		return {
			name: ""
		}
	},
	onNameChange:  function (event) {
		console.log('new name:',event.target.value);
		this.setState({
			name: event.target.value
		})
	},
	onSubmit: function (event) {
		event.preventDefault();
		this.props.onAdd(this.state.name);
		this.setState({name: ""}); // reset input value
	},
	render: function () {
		return (
			<div className="add-player-form">
				<form onSubmit={this.onSubmit}>
					<input type="text" value={this.state.name} onChange={this.onNameChange}/>
					<input type="submit" value="Add new player"/>
				</form>
			</div>
		)
	}
});

function Stats(props) {
	var totalPlayers = props.players.length;
	var totalPoints = props.players.reduce(function(total, player){
		return total + player.score;
	}, 0);
	
	return (
		<table className="stats">
			<tbody>
				<tr>
					<td>Players:</td>
					<td>{totalPlayers}</td>
				</tr>
				<tr>
					<td>Total Points:</td>
					<td>{totalPoints}</td>
				</tr>
			</tbody>
		</table>
	)
}

Stats.propTypes = {
	players: React.PropTypes.array.isRequired
};


function Header (props) {
	return (
		<div className="header">
			<Stats players={props.players}/>
			<h1>{props.title}</h1>
		</div>
	);
}

Header.propTypes = {
	title: React.PropTypes.string.isRequired,
	players: React.PropTypes.array.isRequired
	
};

function Player(props) {
	return (
		<div className="player">
			<div className="player-name">{props.name}</div>
			<a className="remove-player" onClick={props.onRemove}>Remove player</a>
			<div className="player-score">
				<Counter score={props.score}  onChange={props.onScoreChange}/>
			</div>
		</div>
	)
	
}

Player.propTypes = {
	name: React.PropTypes.string.isRequired,
	score: React.PropTypes.number.isRequired,
	onScoreChange: React.PropTypes.func.isRequired,
	onRemove: React.PropTypes.func.isRequired
};

function Counter (props) {
	return (
		<div className="counter">
			<button className="counter-action decrement" onClick={function () {
				props.onChange(-1);
			}}> - </button>
			<div className="counter-score"> {props.score} </div>
			<button className="counter-action increment" onClick={function () {
				props.onChange(+1);
			}}> + </button>
		
		</div>
	);
}

Counter.propTypes = {
	score :  React.PropTypes.number.isRequired,
	onChange : React.PropTypes.func.isRequired
};

var Application = React.createClass({
	propTypes : { // validation
		title: React.PropTypes.string,
		initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
			name: React.PropTypes.string.isRequired,
			score: React.PropTypes.number.isRequired,
			id: React.PropTypes.number.isRequired
		})).isRequired
	},
	getDefaultProps: function () {
		return {
			title : "Scoreboard"
		}
	},
	getInitialState: function () {
		return {
			players: this.props.initialPlayers
		}
	},
	onScoreChange: function(index,delta){
		console.log('score changed for player ', index ,' by ', delta);
		this.state.players[index].score += delta;
		this.setState(this.state);
	},
	onPlayerAdd: function (name) {
		// add new player in the players array
		this.state.players.push({
			name: name,
			score: 0,
			id: nextId
		});
		this.setState(this.state);
		nextId++;
		console.log('added new player ', name);
	},
	onPlayerRemove: function (index) {
		this.state.players.splice(index,1);
		this.setState(this.state);
		console.log('removed player at index ', index );
	},
	render : function () {
		return (
			<div className="scoreboard">
				<Header title = {this.props.title} players={this.state.players}/>
				<div className="players">
					{ this.state.players.map(function(player,index){
						return (<Player
							key = {player.id}
							name = {player.name}
							score = {player.score}
							onScoreChange = {function(delta){
								this.onScoreChange(index,delta)
							}.bind(this)}
							onRemove = { function () {
								this.onPlayerRemove(index)
							}.bind(this)}/>
						)
					}.bind(this))}
				</div>
				<AddPlayerForm onAdd={this.onPlayerAdd}/>
			</div>
		);
		
	}
});

ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));