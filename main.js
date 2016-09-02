function firstPass(val, resolveSync, rejectSync) {
	if (val > 0) {
		resolveSync(val);
	} else {
		rejectSync(val);
	}
}

function secondPass(val, resolveSync, rejectSync) {
	if (val > 500) {
		resolveSync(val);
	} else {
		rejectSync(val);
	}
}

/*
// There'll be exception thrown.
firstPass(1); 

// Named `resolveSync` and `rejectSync` callbacks.
const onFirstPassSuccess = function(val) {
	console.log("First pass: success.");
};

const onFirstPassFailure = function(val) {
	console.log("First pass: failure.");
};

firstPass(1, onFirstPassSuccess, onFirstPassFailure);
firstPass(-1, onFirstPassSuccess, onFirstPassFailure);

// Anonymous `resolveSync` and `rejectSync` callbacks.
firstPass(1, function(val) {
	console.log("First pass: success.");
	secondPass(val, function(val) {
		console.log("Second pass: success.");
	}, function(val) {
		console.log("Second pass: failure.");
	});
}, function(val) {
	console.log("First pass: failure.");
});
*/

function firstPassWithPromise(val) {
	// Reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
	return new Promise(function(resolveAsync, rejectAsync) {
		// console.log("About to handle value " + val);
		if (val > 0) {
			resolveAsync(val);
		} else {
			rejectAsync(val);
		}
		// console.log("The constructor is about to return.");
	});	
}

/*
const p1 = firstPassWithPromise(-1);
const p2 = p1.then(function(val) {
	console.log("#p2# First pass: resolveAsync called.");
}); 
const p3 = p2.then(null, function(val) {
	console.log("#p2# First pass: rejectAsync called.");
});
*/

function secondPassWithPromise(val) {
	const p = new Promise(function(resolve, reject) {
		if (val > 500) {
			resolve(val);
		} else {
			reject(val);
		}
	});	
	return p;
}

/*
const q1 = firstPassWithPromise(1);
const q2 = q1.then(function(val) {
	console.log("#q2# First pass: resolveAsync called.");
	return secondPassWithPromise(val);
});

const q3 = q2.then(function(val) {
	console.log("#q3# Second pass: resolveAsync called.");
}, function(val) {
	console.log("#q3# Second pass: rejectAsync called.");
});

const q3ResolveOnly = q2.then(function(val) {
	console.log("#q3ResolveOnly# Second pass: resolveAsync called.");
});

// Reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch 
const q3ByCatch = q2.catch(function(reason) {
	console.log("#q3ByCatch# Second pass: rejection caught, reason = " + reason);
});

const q3ResolveAndCatch = q2.then(function(val) {
	console.log("#q3ResolveAndCatch# Second pass: resolveAsync called.");
}).catch(function(reason) {
	console.log("#q3ResolveAndCatch# Second pass: rejection caught, reason = " + reason);
});
*/

// State-machine reference https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Description

/* The following chaining trials aim to find a way to
 * - identify which pass rejected the input value so that one could proceed accordingly
 * - interrupt the promise chain upon rejection 
 */

/*
 * NOT working samples
 */

/*
const qChainResolveAndCatchFirstPassFailure = firstPassWithPromise(-1)
		// Promise state = `pending`
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			console.log("#qChainResolveAndCatchFirstPassFailure# First pass: resolveAsync called.");
			return secondPassWithPromise(val);
		})
		// Promise state = `pending`
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			console.log("#qChainResolveAndCatchFirstPassFailure# Second pass: resolveAsync called.");
		})
		// Promise state = `pending`
		.catch(function(reason) {
			// Promise state = `rejected` if executed
			// In this case the `reason` provides no information for identifying which pass rejected the input value.   
			console.log("#qChainResolveAndCatchFirstPassFailure# Rejection caught, reason = " + reason);
		});
		// Promise state = `pending` (returned from catch clause)
*/

/*
const qChainResolveAndCatchSecondPassFailure = firstPassWithPromise(1)
		.then(function(val) {
			console.log("#qChainResolveAndCatchSecondPassFailure# First pass: resolveAsync called.");
			return secondPassWithPromise(val);
		})
		.then(function(val) {
			console.log("#qChainResolveAndCatchSecondPassFailure# Second pass: resolveAsync called.");
		})
		.catch(function(reason) {
			console.log("#qChainResolveAndCatchSecondPassFailure# Rejection caught, reason = " + reason);
		});
*/

/*
const qChainFirstPassFailure = firstPassWithPromise(-1)
		// Promise state = `pending`
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			console.log("#qChainFirstPassFailure# First pass: resolveAsync called.");
			return secondPassWithPromise(val);
		}, function(val) {
			// Promise state = `rejected` if executed
			// In this case the `rejectAsync` function is able to identify which pass rejected the input value, but the promise chain is not interrupted. 
			console.log("#qChainFirstPassFailure# First pass: rejectAsync called.");
		})
		// Promise state = `pending`
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			// This block will be unexpectedly entered.
			console.log("#qChainFirstPassFailure# Second pass: resolveAsync called.");
		}, function(val) {
			// Promise state = `rejected` if executed
			console.log("#qChainFirstPassFailure# Second pass: rejectAsync called.");
		});
		// Promise state = `pending` (returned from the last then clause)
*/
	
/*
const qChainCatchFirstPassFailure = firstPassWithPromise(-1)
		// Promise state = `pending`
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			console.log("#qChainCatchFirstPassFailure# First pass: resolveAsync called.");
			return secondPassWithPromise(val);
		}).catch(function(reason) {
			// Promise state = `rejected` if executed
			// In this case the catch clause is able to identify which pass rejected the input value, but the promise chain is not interrupted. 
			console.log("#qChainCatchFirstPassFailure# First pass: rejection caught, reason = " + reason);
		})
		// Promise state = `pending` (returned from catch clause)
		.then(function(val) {
			// Promise state = `fulfilled` if executed
			// This block will be unexpectedly entered.
			console.log("#qChainCatchFirstPassFailure# Second pass: resolveAsync called.");
		}, function(val) {
			// Promise state = `rejected` if executed
			console.log("#qChainCatchFirstPassFailure# Second pass: rejectAsync called.");
		});
		// Promise state = `pending` (returned from the last then clause)
*/

/*
 * Working sample
 */

function FirstPassFailureSignal(){} 
function SecondPassFailureSignal(){} 

function firstPassWithPromiseAndRejectSignal(val) {
	return new Promise(function(resolveAsync, rejectAsync) {
		if (val > 0) {
			resolveAsync(val);
		} else {
			rejectAsync(new FirstPassFailureSignal());
		}
	});	
}

function secondPassWithPromiseAndRejectSignal(val) {
	const p = new Promise(function(resolve, reject) {
		if (val > 500) {
			resolve(val);
		} else {
			reject(new SecondPassFailureSignal());
		}
	});	
	return p;
}

const qChainResolveAndCatchFirstPassFailureWithSignal = firstPassWithPromiseAndRejectSignal(-1)
		.then(function(val) {
			console.log("#qChainResolveAndCatchFirstPassFailureWithSignal# First pass: resolveAsync called.");
			return secondPassWithPromiseAndRejectSignal(val);
		})
		.then(function(val) {
			console.log("#qChainResolveAndCatchFirstPassFailureWithSignal# Second pass: resolveAsync called.");
		})
		.catch(function(reason) {
			console.log("#qChainResolveAndCatchFirstPassFailureWithSignal# Rejection caught, reason = ", reason);
		});

/*
const qChainResolveAndCatchSecondPassFailureWithSignal = firstPassWithPromiseAndRejectSignal(1)
		.then(function(val) {
			console.log("#qChainResolveAndCatchSecondPassFailureWithSignal# First pass: resolveAsync called.");
			return secondPassWithPromiseAndRejectSignal(val);
		})
		.then(function(val) {
			console.log("#qChainResolveAndCatchSecondPassFailureWithSignal# Second pass: resolveAsync called.");
		})
		.catch(function(reason) {
			console.log("#qChainResolveAndCatchSecondPassFailureWithSignal# Rejection caught, reason = ", reason);
		});
*/

/*
 * One might want to use the `Filtered-Catch` clause from `bluebirds` for better 
 * expressive capability, http://bluebirdjs.com/docs/api/catch.html#filtered-catch.
 */
