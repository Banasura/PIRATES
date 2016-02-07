/******************************************************************************
This file is part of PIRATES.

PIRATES is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

PIRATES is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with PIRATES.  If not, see <http://www.gnu.org/licenses/>.
*******************************************************************************/

/**
* Player Entity
*/
game.Player = me.Entity.extend({

  /**
  * constructor
  */
  init:function (x, y, settings) {
    // call the constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(2, 2);

    this.body.gravity = 0;

    // set the display to follow our position on both axis
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // ensure the player is updated even when outside of the viewport
    this.alwaysUpdate = true;

    // define a basic walking animation (using all frames)
    this.renderable.addAnimation("downWalk",  [0, 1, 2]);
    this.renderable.addAnimation("upWalk",  [36, 37, 38]);
    this.renderable.addAnimation("sideWalk",  [24, 25, 26]);

    // define a standing animation (using the first frame)
    this.renderable.addAnimation("stand",  [1]);
    // set the standing animation as default
    this.renderable.setCurrentAnimation("stand");
  },

  /**
  * update the entity
  */
  update : function (dt) {
    //Go left
    if (me.input.isKeyPressed('left')) {
      // flip the sprite on horizontal axis
      this.renderable.flipX(true);
      // update the entity velocity
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("sideWalk")) {
        this.renderable.setCurrentAnimation("sideWalk");
      }
    //Go right
    } else if (me.input.isKeyPressed('right')) {
      // unflip the sprite
      this.renderable.flipX(false);
      // update the entity velocity
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("sideWalk")) {
        this.renderable.setCurrentAnimation("sideWalk");
      }
    }
    //Doesn't move on x axis
    else {
      this.body.vel.x = 0;
    }

    //Go up
    if (me.input.isKeyPressed('up')){
      this.body.vel.y -= this.body.accel.y * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("upWalk") && !me.input.isKeyPressed('right') && !me.input.isKeyPressed('left')) {
        this.renderable.setCurrentAnimation("upWalk");
      }
    //Go down
    } else if (me.input.isKeyPressed('down')){
      this.body.vel.y += this.body.accel.y * me.timer.tick;
      // change to the walking animation
      if (!this.renderable.isCurrentAnimation("downWalk") && !me.input.isKeyPressed('right') && !me.input.isKeyPressed('left')) {
        this.renderable.setCurrentAnimation("downWalk");
      }
    //Doesn't move on y axis
    } else {
      this.body.vel.y = 0;
    }

    //Stand animation
    if(!me.input.isKeyPressed('up') && !me.input.isKeyPressed('down') && !me.input.isKeyPressed('left') && !me.input.isKeyPressed('right')){
      this.renderable.setCurrentAnimation("stand");
    }

    // apply physics to the body (this moves the entity)
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
  * colision handler
  * (called when colliding with other objects)
  */
  onCollision : function (response, other) {
    //TODO : if includes doesn't work on some browser, check https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String/includes
    if(other.name.includes("player")){
      return false;
    }

    // Make all other objects solid
    return true;
  }
});
