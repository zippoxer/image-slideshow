import React, { Component } from 'react';

import './css/mod.scss';

// Mod (from modify) is an interface to experiment with Slideshow. 
export default class Mod extends Component {
	static propTypes = {
		onSlideAdd: React.PropTypes.func.isRequired,
		onSlideRemove: React.PropTypes.func.isRequired,
		onRoundRobinChange: React.PropTypes.func.isRequired
	};
	
	state = {
		imageURL: null,
		title: "",
		subtitle: "",
		link: ""
	}
	
	handleFileChange = (e) => {
		if(e.target.files.length == 0) {
			return;
		}
		// Render file as image.
		let reader = new FileReader();
		reader.readAsDataURL(e.target.files[0]);
		reader.onload = (upload) => {
			this.setState({
				imageURL: upload.target.result
			});
		};
	};
	
	handleFieldChange = (field, e) => {
		let set = {};
		set[field] = e.target.value;
		this.setState(set);
	};
	
	handleAdd = () => {
		this.props.onSlideAdd({
			imageURL: this.state.imageURL,
			title: this.state.title,
			subtitle: this.state.subtitle,
			link: this.state.link
		});
	};
	
	handleRemove = () => {
		this.props.onSlideRemove();
	};
	
	handleCancel = () => {
		this.setState({imageURL: null});
	};
	
	handleRoundRobinChange = (e) => {
		this.props.onRoundRobinChange(e.target.checked);
	};
	
	render() {
		let {imageURL} = this.state;
		
		let addSlideNode;
		if(imageURL) {
			addSlideNode = (
				<div>
					<div className="thumb">
						<img src={imageURL} />
					</div>
					<input type="text"
						placeholder="Title"
						value={this.title}
						onInput={this.handleFieldChange.bind(this, "title")} />
					<input type="text"
						placeholder="Subtitle" 
						value={this.title}
						onInput={this.handleFieldChange.bind(this, "subtitle")} />
					<input type="text"
						placeholder="Link" 
						value={this.title}
						onInput={this.handleFieldChange.bind(this, "link")} />
					<input type="button"
						value="Add"
						onClick={this.handleAdd} />
					<input type="button"
						value="Cancel"
						className="cancel-btn"
						onClick={this.handleCancel} />
				</div>
			);
		} else {
			addSlideNode = (
				<input type="file"
					ref={(ref) => {this.fileInput = ref}}
					onChange={this.handleFileChange} />
			);
		}
		
		return (
			<div className="mod">
				<div className="container">
					<div className="col mod-add-slide">
						<h3>Add a slide</h3>
						
						{addSlideNode}
					</div>
					<div className="col mod-tweak">
						<h3>Tweak the slideshow</h3>
						<label>
							<input type="checkbox"
								onChange={this.handleRoundRobinChange} />
							&nbsp;Round-robin
						</label>
						<br /><br />
						<i>More settings in Slideshow.js</i>
					</div>
					<div className="col">
						<h3>Current slide</h3>
						<input type="button" value="Remove" onClick={this.handleRemove} />
					</div>
					<div className="clear"></div>
				</div>
			</div>
		);
	}
}