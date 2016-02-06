'use strict'

module.exports = IntegratorFactory

var Integrator = function Integrator( y0, deriv, t, dt ) {
  // Bind variables to this:
  this.deriv = deriv
  this.y = y0
  this.n = this.y.length
  this.dt = dt
  this.t = t

  // Create a scratch array into which we compute the derivative:
  this._ctor = this.y.constructor
  this._yp = new this._ctor( this.n )
  this._yguess = new this._ctor( this.n )
}

Integrator.prototype.step = function() {
  var i, n
  for(i=0; i<this.n; i++) {
    this._yguess[i] = this.y[i]
  }

  for (n = 0; n < 10; n++) {
    this.deriv( this._yp, this._yguess, this.t + this.dt)

    for(i=0; i<this.n; i++) {
      this._yguess[i] = this.y[i] + this._yp[i] * this.dt
    }
  }

  this.deriv( this._yp, this._yguess, this.t + this.dt)

  for(i=0; i<this.n; i++) {
    this.y[i] += this._yp[i] * this.dt
  }

  this.t += this.dt
  return this
}

Integrator.prototype.steps = function( n ) {
  for(var step=0; step<n; step++) {
    this.step()
  }
  return this
}

function IntegratorFactory( y0, deriv, t, dt ) {
  return new Integrator( y0, deriv, t, dt )
}

