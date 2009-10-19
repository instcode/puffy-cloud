// Javascript Game Engine (C) 2009 by instcode

var Sprite = function(image, width, height, hframe, vframe) {
    this.image = image;
    this.frames = [];
    var w = width / hframe;
    var h = height / vframe;
    for (var frame = 0; frame < hframe * vframe; frame++) {
          this.frames[frame] = {
               x: - ((frame % hframe) * w),
               y: - (Math.floor(frame / hframe) * h)
          }
    }
    this.draw = function(e, frame) {
        e.style.backgroundPosition = this.frames[frame].x + "px " + this.frames[frame].y + "px";
        e.style.backgroundImage = "url('" + this.image + "')";
        e.style.width = w + "px";
        e.style.height = h + "px";
    }
}

var Entity = function(id, sprite) {
	this.sprite = sprite;
	this.frame = 0;
	this.element = document.createElement("div");
	this.element.id = id;
	this.element.style.position = "absolute";
	this.entities = [];
	
	this.setFrame = function(frame) {
		this.frame = frame;
	}
	
	this.setPosition = function(x, y) {
		this.element.style.left = x + "px";
		this.element.style.top = y + "px";
	}
	
	this.getPosition = function() {
		return {x: this.element.offsetLeft, y: this.element.offsetTop};
	}
	
	this.setVisible = function(visible) {
		if (visible) {
			this.element.style.display = "block";
		}
		else {
			this.element.style.display = "none";
		}
	}
	
	this.clear = function() {
		this.setVisible(false);
	}
	
	this.draw = function() {
		this.sprite.draw(this.element, this.frame);
		this.setVisible(true);
	}
	
	this.add = function(index, entity) {
		if (entity != null) {
			this.entities[index] = entity;
			this.element.appendChild(entity.element);
		}
	}
	
	this.get = function(index) {
		return this.entities[index];
	}
	
	this.children = function() {
		return this.entities;
	}
}