import React from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

function loadScript (src) {
	return new Promise((resolve) => {
		const script = document.createElement('script');
		script.src = src;
		script.onload = () => {
			resolve(true);
		};
		script.onerror = () => {
			resolve(false);
		};
		document.body.appendChild(script);
	});
}
const __DEV__ = document.domain === 'localhost';
const HireNow = (props) => {
	const [ response, setresponse ] = React.useState('');
	async function displayRazorpay () {
		alert('payment is in test mode,you will not be charged');
		const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

		if (!res) {
			alert('Razorpay SDK failed to load. Are you online?');
			return;
		}
		const token = Cookies.get('session-id');
		const data = await fetch('http://localhost:5000/api/payment/razorpay/' + props.profile._id, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`
			},
			body: {}
		}).then((t) => t.json());

		const options = {
			key: __DEV__ ? process.env.REACT_APP_RAZORPAY_ID : process.env.REACT_APP_RAZORPAY_ID,
			currency: data.currency,
			amount: data.amount,
			order_id: data.id,
			name: props.profile.user.firstname + props.profile.user.lastname,
			description: 'Thank you for hiring',
			image:
				'https://res.cloudinary.com/marketgaddevcloud1/image/upload/v1600260487/Product_Profiles/logo/MarketGad%205f620819ea33410004b6c10c.jpg',
			handler: function (response) {
				setresponse(response);
			},
			prefill: {
				name: '',
				email: '',
				phone_number: ''
			}
		};
		const paymentObject = new window.Razorpay(options);
		paymentObject.open();
	}
	console.log(response);
	return (
		<div>
			<a
				onClick={displayRazorpay}
				target='_blank'
				rel='noopener noreferrer'
				className='waves-effect waves-light btn-small hirenow-btn'
				style={{ marginTop: '2%' }}
			>
				Hire Now
			</a>
		</div>
	);
};

export default HireNow;
