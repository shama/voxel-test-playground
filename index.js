var createGame = require('voxel-engine')
var highlight = require('voxel-highlight')
var player = require('voxel-player')
var texturePath = require('painterly-textures')(__dirname)
var voxel = require('voxel')
var extend = require('extend')
var fly = require('voxel-fly')



module.exports = function (opts, setup) {
  setup = setup || defaultSetup
  var defaults = {
    generate: function(x,y,z) {
      if (y === -1) { return 1;}
    },
    chunkDistance: 1,
    chunkSize: 16,
    materials: [
      ['grass', 'dirt', 'grass_dirt'],
      'obsidian',
      'brick',
      'grass',
      'plank'
    ],
    generateChunks: true,
    texturePath: texturePath,
    worldOrigin: [0, 0, 0],
    controls: { discreteFire: true }
  }
  opts = extend({}, defaults, opts || {})

  // setup the game and add some trees
  var game = createGame(opts)
  var container = opts.container || document.body
  window.game = game // for debugging
  game.appendTo(container)
  if (game.notCapable()) return game

  var createPlayer = player(game)

  // create the player from a minecraft skin file and tell the
  // game to use it as the main player
  var avatar = createPlayer(opts.playerSkin || 'player.png')
  avatar.possess()
  avatar.yaw.position.set(2, 14, 4)
  var makeFly = fly(game)
  makeFly(avatar)
  setup(game, avatar)


  game.once('tick', function() {
    var tower = [
      1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1,
      1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1,
      1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1,
      1, 2, 1, 3, 1, 2, 3, 1, 2, 1, 2, 3, 1, 2, 3, 2, 1, 2, 3, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1
    ]
    tower.forEach(function (item, i) {
      var pos = [1,i,2]
      console.log(pos)
      game.createBlock(pos, item)
    });
  });

  return game

}

function defaultSetup(game, avatar) {
  // highlight blocks when you look at them, hold <Ctrl> for block placement
  var blockPosPlace, blockPosErase
  var hl = game.highlighter = highlight(game, { color: 0xff0000 })
  hl.on('highlight', function (voxelPos) {
    blockPosErase = voxelPos
  })
  hl.on('remove', function (voxelPos) {
    blockPosErase = null
  })
  hl.on('highlight-adjacent', function (voxelPos) {
    blockPosPlace = voxelPos
  })
  hl.on('remove-adjacent', function (voxelPos) {
    blockPosPlace = null
  })

  // toggle between first and third person modes
  window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) avatar.toggle()
  })

  // block interaction stuff, uses highlight data
  var currentMaterial = 1

  game.on('fire', function (target, state) {
    var position = blockPosPlace
    if (position) {
      game.createBlock(position, currentMaterial)
    }
    else {
      position = blockPosErase
      if (position) game.setBlock(position, 0)
    }
  })

}
