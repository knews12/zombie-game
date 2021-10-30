/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var app;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __extends = (this && this.__extends) || (function () {\n    var extendStatics = function (d, b) {\n        extendStatics = Object.setPrototypeOf ||\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\n            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };\n        return extendStatics(d, b);\n    };\n    return function (d, b) {\n        if (typeof b !== \"function\" && b !== null)\n            throw new TypeError(\"Class extends value \" + String(b) + \" is not a constructor or null\");\n        extendStatics(d, b);\n        function __() { this.constructor = d; }\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\n    };\n})();\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.game = exports.FieldScene = void 0;\nvar Phaser = __webpack_require__(/*! phaser */ \"./node_modules/phaser/dist/phaser.js\");\nvar ZombieState;\n(function (ZombieState) {\n    ZombieState[ZombieState[\"Idle\"] = 0] = \"Idle\";\n    ZombieState[ZombieState[\"MovingUp\"] = 1] = \"MovingUp\";\n    ZombieState[ZombieState[\"MovingDown\"] = 2] = \"MovingDown\";\n    ZombieState[ZombieState[\"MovingLeft\"] = 3] = \"MovingLeft\";\n    ZombieState[ZombieState[\"MovingRight\"] = 4] = \"MovingRight\";\n})(ZombieState || (ZombieState = {}));\nvar FieldScene = /** @class */ (function (_super) {\n    __extends(FieldScene, _super);\n    function FieldScene() {\n        var _this = _super !== null && _super.apply(this, arguments) || this;\n        _this.playerSpeed = 400;\n        _this.score = 0;\n        _this.hasScored = false;\n        _this.level = 1;\n        _this.zombieScaleFactor = 1;\n        return _this;\n    }\n    //---------------------------------------------------------------\n    // Phaser Scene Functions\n    //---------------------------------------------------------------\n    FieldScene.prototype.preload = function () {\n        this.load.image('ground', 'assets/platform.png');\n        this.load.image('headstone', 'assets/large_headstone.png');\n        this.load.image('jackolatern', 'assets/lackolatern.png');\n        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });\n        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 48 });\n        this.load.spritesheet('zombieSprite', 'assets/zombie.png', { frameWidth: 400, frameHeight: 548 });\n        this.load.audio('impact', ['assets/audio/impactPunch_medium_000.ogg']);\n        this.load.audio('whistle', ['assets/audio/fischio_rigore.mp3']);\n    };\n    FieldScene.prototype.create = function () {\n        this.playerStartPosition = new Phaser.Math.Vector2(50, this.game.scale.height / 2);\n        this.cursors = this.input.keyboard.createCursorKeys();\n        // this.cameras.main.setSize(400, 300);\n        // this.cameraControl = new Phaser.Cameras.Controls.FixedKeyControl({\n        //     camera: this.cameras.main,\n        //     left: this.cursors.left,\n        //     right: this.cursors.right,\n        //     speed: 0.25\n        // });\n        this.createField();\n        this.createPlayer();\n        this.createZombies();\n        this.createObstacles();\n        this.scoreText = this.add.text(16, 16, \"Score: \" + this.score, {\n            fontSize: '24px',\n            color: '#eb4034',\n            stroke: '#eb4034',\n            strokeThickness: 2\n        });\n        this.whistle = this.sound.add('whistle', { volume: 0.3 });\n        this.impactSound = this.sound.add('impact');\n    };\n    FieldScene.prototype.update = function (time, delta) {\n        this.updatePlayer();\n        this.updateZombies();\n        //this.cameraControl.update(delta);\n    };\n    //---------------------------------------------------------------\n    // Helper Functions\n    //---------------------------------------------------------------\n    // Player\n    //---------------------------------------------------------------\n    FieldScene.prototype.createPlayer = function () {\n        this.player = this.physics.add.sprite(this.playerStartPosition.x, this.playerStartPosition.y, 'player');\n        this.player.setCollideWorldBounds(true);\n        this.anims.create({\n            key: 'left',\n            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),\n            frameRate: 10,\n            repeat: -1\n        });\n        this.anims.create({\n            key: 'turn',\n            frames: [{ key: 'player', frame: 4 }],\n            frameRate: 20\n        });\n        this.anims.create({\n            key: 'right',\n            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),\n            frameRate: 10,\n            repeat: -1\n        });\n        this.anims.create({\n            key: 'tackled',\n            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),\n            frameRate: 24,\n        });\n    };\n    FieldScene.prototype.updatePlayer = function () {\n        // Detect touchdown\n        if (!this.hasScored && Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.endZone.getBounds())) {\n            this.touchDown();\n        }\n        if (this.player.getData('tackled')) {\n            if (this.player.anims.currentAnim.key !== 'tackled') {\n                this.player.anims.play('tackled', true);\n            }\n            this.player.setVelocity(0);\n            return;\n        }\n        if (this.cursors.left.isDown) {\n            this.player.setVelocityX(-1 * this.playerSpeed);\n            this.player.anims.play('left', true);\n        }\n        else if (this.cursors.right.isDown) {\n            this.player.setVelocityX(this.playerSpeed);\n            this.player.anims.play('right', true);\n        }\n        else {\n            this.player.setVelocityX(0);\n            this.player.anims.play('turn');\n        }\n        if (this.cursors.up.isDown) {\n            this.player.setVelocityY(-1 * this.playerSpeed);\n        }\n        else if (this.cursors.down.isDown) {\n            this.player.setVelocityY(this.playerSpeed);\n        }\n        else {\n            this.player.setVelocityY(0);\n        }\n    };\n    // Zombies\n    //---------------------------------------------------------------\n    FieldScene.prototype.createZombies = function () {\n        this.zombies = this.physics.add.group();\n        this.physics.add.collider(this.zombies, this.player, this.tackled, null, this);\n        // Scale the number zombie based in the screen size\n        this.zombieScaleFactor = Math.max(Math.floor((this.game.scale.width * this.game.scale.height) / 200000), 0);\n        this.addZombies(this.level);\n        this.anims.create({\n            key: 'zombie-left',\n            frames: this.anims.generateFrameNumbers('zombieSprite', { start: 0, end: 1 }),\n            frameRate: 10,\n            repeat: -1\n        });\n        this.anims.create({\n            key: 'zombie-turn',\n            frames: [{ key: 'zombieSprite', frame: 2 }],\n            frameRate: 20\n        });\n        this.anims.create({\n            key: 'zombie-right',\n            frames: this.anims.generateFrameNumbers('zombieSprite', { start: 3, end: 4 }),\n            frameRate: 10,\n            repeat: -1\n        });\n    };\n    FieldScene.prototype.addZombies = function (n) {\n        n = n + this.zombieScaleFactor;\n        for (var index = 0; index < n; index++) {\n            var x = Phaser.Math.Between(this.playerStartPosition.x + 200, this.endZone.x - this.endZone.width);\n            var y = Phaser.Math.Between(50, this.game.scale.height - 50);\n            var zombie = this.zombies.create(x, y, 'zombieSprite');\n            zombie.setScale(0.1);\n            zombie.setBounce(1);\n            zombie.setCollideWorldBounds(true);\n            //zombie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));\n            zombie.setData('state', this.randomZombieState());\n            zombie.setData('lastStateChange', this.game.getTime());\n        }\n    };\n    FieldScene.prototype.updateZombies = function () {\n        var _this = this;\n        this.zombies.children.iterate(function (zombie) {\n            var currentState = zombie.getData('state');\n            switch (currentState) {\n                case ZombieState.Idle:\n                    zombie.setVelocity(0);\n                    zombie.anims.play('zombie-turn', true);\n                    break;\n                case ZombieState.MovingUp:\n                    zombie.setVelocity(0, -100);\n                    zombie.anims.play('zombie-left', true);\n                    break;\n                case ZombieState.MovingDown:\n                    zombie.setVelocity(0, 100);\n                    zombie.anims.play('zombie-left', true);\n                    break;\n                case ZombieState.MovingLeft:\n                    zombie.setVelocity(-100, 0);\n                    zombie.anims.play('zombie-left', true);\n                    break;\n                case ZombieState.MovingRight:\n                    zombie.setVelocity(100, 0);\n                    zombie.anims.play('zombie-right', true);\n                    break;\n                default:\n                    break;\n            }\n            // Change state randomly\n            var currentTime = _this.game.getTime();\n            var lastStateChange = Math.round(zombie.getData('lastStateChange'));\n            if (currentTime - lastStateChange > 2000) {\n                zombie.setData('state', _this.randomZombieState());\n                zombie.setData('lastStateChange', _this.game.getTime());\n            }\n        });\n    };\n    FieldScene.prototype.randomZombieState = function () {\n        var r = Phaser.Math.Between(0, 4);\n        switch (r) {\n            case 0:\n                return ZombieState.Idle;\n            case 1:\n                return ZombieState.MovingUp;\n            case 2:\n                return ZombieState.MovingDown;\n            case 3:\n                return ZombieState.MovingLeft;\n            case 4:\n                return ZombieState.MovingRight;\n            default:\n                return ZombieState.Idle;\n        }\n    };\n    // Environment\n    //---------------------------------------------------------------\n    FieldScene.prototype.createField = function () {\n        this.createEndZone();\n        // Create 10 yard lines\n        var tenYardLineWidth = 200;\n        var tenYardLineXPositoin = this.endZone.x - this.endZone.width / 2 - tenYardLineWidth;\n        while (tenYardLineXPositoin >= 0) {\n            this.add.line(tenYardLineXPositoin, this.game.scale.height / 2, 0, 0, 0, this.game.scale.height, 0xffffff);\n            tenYardLineXPositoin -= tenYardLineWidth;\n        }\n        // Create hash lines\n        var hashYardLineWidth = 20;\n        var hashYardLineXPositoin = this.endZone.x - this.endZone.width / 2 - hashYardLineWidth;\n        while (hashYardLineXPositoin >= 0) {\n            // Top\n            this.add.line(hashYardLineXPositoin, 10, 0, 0, 0, 10, 0xffffff);\n            // Top inside\n            this.add.line(hashYardLineXPositoin, this.game.scale.height / 3, 0, 0, 0, 30, 0xffffff);\n            // Bottom inside\n            this.add.line(hashYardLineXPositoin, this.game.scale.height - this.game.scale.height / 3, 0, 0, 0, 30, 0xffffff);\n            // Bottom\n            this.add.line(hashYardLineXPositoin, this.game.scale.height - 10, 0, 0, 0, 10, 0xffffff);\n            hashYardLineXPositoin -= hashYardLineWidth;\n        }\n    };\n    FieldScene.prototype.createEndZone = function () {\n        var endZoneWidth = 200;\n        this.endZone = this.add.rectangle(this.game.scale.width - endZoneWidth / 2, this.game.scale.height / 2, endZoneWidth, this.game.scale.height, 0x00cf03);\n        var endZoneText = this.add.text(this.game.scale.width - 50, 100, 'ENDZONE', { fontSize: '88px' });\n        endZoneText.setRotation(Phaser.Math.DegToRad(90));\n    };\n    FieldScene.prototype.createObstacles = function () {\n        var obstacles = this.physics.add.staticGroup();\n        var numberOfObstacles = this.zombieScaleFactor + 1;\n        for (var index = 0; index < numberOfObstacles; index++) {\n            var x = Phaser.Math.Between(this.playerStartPosition.x + 200, this.endZone.x - this.endZone.width);\n            var y = Phaser.Math.Between(50, this.game.scale.height - 50);\n            obstacles.create(x, y, index % 2 == 0 ? 'headstone' : 'jackolatern');\n        }\n        this.physics.add.collider(this.player, obstacles);\n        this.physics.add.collider(this.zombies, obstacles);\n    };\n    FieldScene.prototype.touchDown = function () {\n        if (this.hasScored) {\n            return;\n        }\n        this.whistle.play();\n        this.setScore(this.score + 7);\n        this.hasScored = true;\n        this.time.delayedCall(2000, this.reset, [this.level + 1], this);\n    };\n    FieldScene.prototype.tackled = function () {\n        if (this.hasScored || this.player.getData('tackled')) {\n            return;\n        }\n        this.impactSound.play();\n        this.setScore(0);\n        this.player.setData('tackled', true);\n        this.time.delayedCall(2000, this.reset, [1], this);\n        //this.reset(1);\n    };\n    FieldScene.prototype.setScore = function (score) {\n        this.score = score;\n        this.scoreText.setText(\"Score: \" + this.score);\n    };\n    FieldScene.prototype.reset = function (level) {\n        console.log('resetting');\n        this.level = level;\n        this.player.setPosition(this.playerStartPosition.x, this.playerStartPosition.y);\n        this.player.setData('tackled', false);\n        this.hasScored = false;\n        // Reset zombies\n        this.zombies.clear(true, true);\n        this.addZombies(this.level);\n    };\n    return FieldScene;\n}(Phaser.Scene));\nexports.FieldScene = FieldScene;\nvar gameConfig = {\n    title: 'Sample',\n    type: Phaser.AUTO,\n    scale: {\n        width: window.innerWidth,\n        height: window.innerHeight,\n    },\n    physics: {\n        default: 'arcade',\n        arcade: {\n            debug: false\n        },\n    },\n    parent: 'game',\n    backgroundColor: '#065225',\n    scene: FieldScene\n};\nexports.game = new Phaser.Game(gameConfig);\n\n\n//# sourceURL=webpack://app/./src/main.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"app": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkIds[i]] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkapp"] = self["webpackChunkapp"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors"], () => (__webpack_require__("./src/main.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	app = __webpack_exports__;
/******/ 	
/******/ })()
;