const miscAssetHandler = require("./miscAssetHandler")
const sharp = require("sharp")

class Tile {
  constructor(number, name, baseLayer, additionalLayers = [], width = 1, height = 1, rotate = 0, flipHorizontal = false, flipVertical = false) {
    this.number = number
    this.name = name;
    this.width = width;
    this.height = height;
    this.tileImage = miscAssetHandler.pathToBase64(miscAssetHandler.mkPath(baseLayer));
    this.additionalLayers = miscAssetHandler.pathArrToBase64(additionalLayers)
    this.rotate = rotate
    this.flipHorizontal = flipHorizontal
    this.flipVertical = flipVertical

    const requiresProcessing = additionalLayers.length > 0 || rotate || flipHorizontal || flipVertical
    if(requiresProcessing) {
      this.doAdditionalProcessing(rotate, flipHorizontal,flipVertical)
    }
  }

  setTileImage(b64){
    this.tileImage = b64;
  }

  doAdditionalProcessing(rotate, flipHorizontal, flipVertical) {
    const rawb64 = this.tileImage.replace("data:image/png;base64, ", "") // strip b64 png header
    const sharpInstance = sharp(Buffer.from(rawb64, "base64"))
    
    const compositeOptionsArr = []

    if(this.additionalLayers.length > 0) {
      this.additionalLayers.forEach(layer => {
        const optionsObj = {}
        if(this.name.startsWith("teleporter")) {
          optionsObj["top"] = 13
          optionsObj["left"] = 20
        }
        const rawLayer = layer.replace("data:image/png;base64, ", "")
        optionsObj["input"] = Buffer.from(rawLayer, "base64")
        compositeOptionsArr.push(optionsObj)
      })
    }
    sharpInstance.composite(compositeOptionsArr)
    .toBuffer((err, data, meta) => {  // composited images must be flattened to buffer before more operations
      if(err) {
        console.error(err)
      } else {
        const sharpInstance2 = sharp(data) // import buffer into new sharp instance
        if(rotate) {
          sharpInstance2.rotate(rotate)
        }
        if(flipHorizontal) {
          sharpInstance2.flop()
        }
        if(flipVertical) {
          sharpInstance2.flip()
        }
        sharpInstance2.toBuffer((err, data, meta) => {
          if(err) {
            console.error(err)
          } else {
            this.tileImage = "data:image/png;base64, " + data.toString("base64")
          }
        })
      }
    })
  }
}

let tileLibrary = []
function buildTileLibrary() {
  tileLibrary = [
    new Tile(0, "air", null), // tools
    new Tile(1, "sign", "1345.png"), // /tools 0-1
    new Tile(2, "unarmored-center", "449.png"), // basic
    new Tile(3, "unarmored-center-decoration-1", "452.png"),
    new Tile(4, "unarmored-center-decoration-2", "455.png"),
    new Tile(5, "unarmored-center-decoration-3", "458.png"),
    new Tile(6, "unarmored-center-decoration-4", "461.png"),
    new Tile(7, "unarmored-center-decoration-5", "464.png"),
    new Tile(8, "unarmored-center-decoration-6", "467.png"),
    new Tile(9, "unarmored-center-decoration-7", "470.png"),
    new Tile(10, "unarmored-floor-left", "473.png"),
    new Tile(11, "unarmored-floor-middle", "476.png"),
    new Tile(12, "unarmored-floor-right", "479.png"),
    new Tile(13, "unarmored-wall-left", "482.png"),
    new Tile(14, "unarmored-wall-right", "485.png"),
    new Tile(15, "unarmored-ceiling-left", "488.png"),
    new Tile(16, "unarmored-ceiling-middle", "491.png"),
    new Tile(17, "unarmored-ceiling right", "494.png"),
    new Tile(18, "armored-floor-left", "413.png"),
    new Tile(19, "armored-floor-middle", "416.png"),
    new Tile(20, "armored-floor-right", "419.png"),
    new Tile(21, "armored-wall-left", "422.png"),
    new Tile(22, "armored-center-emblem", "425.png"),
    new Tile(23, "armored-wall-right", "428.png"),
    new Tile(24, "armored-ceiling-left", "431.png"),
    new Tile(25, "armored-ceiling-middle", "434.png"),
    new Tile(26, "armored-ceiling-right", "437.png"),
    new Tile(27, "armored-ceiling-middle-decoration", "440.png"),
    new Tile(28, "armored-center", "443.png"),
    new Tile(29, "armored-floor-middle-decoration", "446.png"), // /basic 2-29
    new Tile(30, "archway-top", "497.png", [], 2), // multi
    new Tile(31, "archway-pillars-1", "500.png", [], 2),
    new Tile(32, "archway-pillars-2", "503.png", [], 2),
    new Tile(33, "archway-bottom", "506.png", [], 2), // /multi 30-33
    new Tile(34, "pipe-se", "509.png"), // decoration
    new Tile(35, "pipe-sw", "512.png"),
    new Tile(36, "pipe-ne", "515.png"),
    new Tile(37, "pipe-nw", "518.png"),
    new Tile(38, "pipe-ew", "521.png"),
    new Tile(39, "pipe-ns", "524.png"),
    new Tile(40, "pipe-sc-terminate", "527.png"),
    new Tile(41, "pipe-ec-terminate", "530.png"),
    new Tile(42, "pipe-wc-terminate", "533.png"),
    new Tile(43, "pipe-generator-1", "536.png"),
    new Tile(44, "pipe-generator-2", "539.png"), // /decoration 34-44
    new Tile(45, "unarmored-one-tall-right", "581.png"), // basic
    new Tile(46, "unarmored-one-tall-left", "584.png"),
    new Tile(47, "unarmored-floor-one-wide", "587.png"),
    new Tile(48, "unarmored-middle-one-wide", "590.png"),
    new Tile(49, "unarmored-platform-1x1", "593.png"),
    new Tile(50, "unarmored-one-tall-middle", "596.png"),
    new Tile(51, "unarmored-ceiling-one-wide", "599.png"),
    new Tile(52, "armored-one-wide-1", "557.png"),
    new Tile(53, "armored-one-tall-left", "560.png"),
    new Tile(54, "armored-one-tall-center", "563.png"),
    new Tile(55, "armored-one-tall-right", "566.png"),
    new Tile(56, "armored-one-wide-2", "569.png"),
    new Tile(57, "armored-one-wide-top", "572.png"),
    new Tile(58, "armored-one-by-one", "575.png"),
    new Tile(59, "armored-one-wide-bottom", "578.png"), // /basic 45-59
    new Tile(60, "UNUSED", null), // unused / 60
    new Tile(61, "armored-bottom-emblem", "602.png"), // basic / 61
    new Tile(62, "archway-top-platform", "605.png", [], 2), // multi / 62
    new Tile(63, "upwards-spotlight", "620.jpeg"), // decoration
    new Tile(64, "downwards-spotlight", "623.jpeg"),
    new Tile(65, "banner-top-with-spotlight", "608.jpeg"),
    new Tile(66, "banner-bottom-for-spotlight", "611.jpeg"),
    new Tile(67, "banner-top-no-light", "614.jpeg"),
    new Tile(68, "banner-bottom", "617.jpeg"), // /decoration 63-68
    new Tile(69, "UNUSED", null), // unused 
    new Tile(70, "UNUSED", null),
    new Tile(71, "UNUSED", null),
    new Tile(72, "UNUSED", null),// /unused 69-72
    new Tile(73, "unarmored-floor-decoration", "626.png"), // basic
    new Tile(74, "unarmored-center-decoration-8", "629.png"),
    new Tile(75, "unarmored-center-decoration-9", "632.png"),
    new Tile(76, "unarmored-center-decoration-10", "635.png"),
    new Tile(77, "unarmored-center-3d-look", "638.png"),
    new Tile(78, "unarmored-center-GB-flag", "641.png"), // /basic 73-78
    new Tile(79, "UNUSED", null),// unused 
    new Tile(80, "UNUSED", null),
    new Tile(81, "UNUSED", null),
    new Tile(82, "UNUSED", null),
    new Tile(83, "UNUSED", null),
    new Tile(84, "UNUSED", null),
    new Tile(85, "UNUSED", null),
    new Tile(86, "UNUSED", null),
    new Tile(87, "UNUSED", null),
    new Tile(88, "UNUSED", null), // /unused 79-88
    new Tile(89, "moving-platform-one-by-one-up-1", "795.png"), // moving
    new Tile(90, "moving-platform-one-by-one-right-1", "795.png"),
    new Tile(91, "moving-platform-one-by-one-down-1", "795.png"),
    new Tile(92, "moving-platform-one-by-one-left-1", "795.png"),
    new Tile(93, "moving-platform-one-by-one-up-2", "795.png"),
    new Tile(94, "moving-platform-one-by-one-right-2", "795.png"),
    new Tile(95, "moving-platform-one-by-one-down-2", "795.png"),
    new Tile(96, "moving-platform-one-by-one-left-2", "795.png"),
    new Tile(97, "moving-platform-one-by-one-up-3", "795.png"),
    new Tile(98, "moving-platform-one-by-one-right-3", "795.png"),
    new Tile(99, "moving-platform-one-by-one-down-3", "795.png"),
    new Tile(100, "moving-platform-one-by-one-left-3", "795.png"),
    new Tile(101, "moving-platform-one-by-one-up-4", "795.png"),
    new Tile(102, "moving-platform-one-by-one-right-4", "795.png"),
    new Tile(103, "moving-platform-one-by-one-down-4", "795.png"),
    new Tile(104, "moving-platform-one-by-one-left-4", "795.png"),
    new Tile(105, "moving-platform-two-wide-up-1", "780.png", [], 2),
    new Tile(106, "moving-platform-two-wide-left-1", "780.png", [], 2),
    new Tile(107, "moving-platform-two-wide-down-1", "780.png", [], 2),
    new Tile(108, "moving-platform-two-wide-right-1", "780.png", [], 2),
    new Tile(109, "moving-platform-two-wide-up-2", "780.png", [], 2),
    new Tile(110, "moving-platform-two-wide-left-2", "780.png", [], 2),
    new Tile(111, "moving-platform-two-wide-down-2", "780.png", [], 2),
    new Tile(112, "moving-platform-two-wide-right-2", "780.png", [], 2),
    new Tile(113, "moving-platform-two-wide-up-3", "780.png", [], 2),
    new Tile(114, "moving-platform-two-wide-left-3", "780.png", [], 2),
    new Tile(115, "moving-platform-two-wide-down-3", "780.png", [], 2),
    new Tile(116, "moving-platform-two-wide-right-3", "780.png", [], 2),
    new Tile(117, "moving-platform-three-high-up-1", "769.png", [], 1, 3),
    new Tile(118, "moving-platform-three-high-left-1", "769.png", [], 1, 3),
    new Tile(119, "moving-platform-three-high-down-1", "769.png", [], 1, 3),
    new Tile(120, "moving-platform-three-high-right-1", "769.png", [], 1, 3),
    new Tile(121, "moving-platform-three-high-up-2", "769.png", [], 1, 3),
    new Tile(122, "moving-platform-three-high-left-2", "769.png", [], 1, 3),
    new Tile(123, "moving-platform-three-high-down-2", "769.png", [], 1, 3),
    new Tile(124, "moving-platform-three-high-right-2", "769.png", [], 1, 3), // /moving 89-124
    new Tile(125, "teleporter-2-way-upwards-1", "873.png", [], 1, 1, 270), // teleporter
    new Tile(126, "teleporter-2-way-upwards-2", "873.png", [], 1, 1, 270),
    new Tile(127, "teleporter-2-way-upwards-3", "873.png", [], 1, 1, 270),
    new Tile(128, "teleporter-2-way-upwards-4", "873.png", [], 1, 1, 270),
    new Tile(129, "teleporter-2-way-upwards-5", "873.png", [], 1, 1, 270),
    new Tile(130, "teleporter-2-way-upwards-6", "873.png", [], 1, 1, 270),
    new Tile(131, "teleporter-2-way-upwards-7", "873.png", [], 1, 1, 270),
    new Tile(132, "teleporter-2-way-upwards-8", "873.png", [], 1, 1, 270),
    new Tile(133, "teleporter-2-way-upwards-9", "873.png", [], 1, 1, 270),
    new Tile(134, "teleporter-2-way-upwards-10", "873.png", [], 1, 1, 270),
    new Tile(135, "teleporter-2-way-rightwards-1", "873.png"),
    new Tile(136, "teleporter-2-way-rightwards-2", "873.png"),
    new Tile(137, "teleporter-2-way-rightwards-3", "873.png"),
    new Tile(138, "teleporter-2-way-rightwards-4", "873.png"),
    new Tile(139, "teleporter-2-way-rightwards-5", "873.png"),
    new Tile(140, "teleporter-2-way-rightwards-6", "873.png"),
    new Tile(141, "teleporter-2-way-rightwards-7", "873.png"),
    new Tile(142, "teleporter-2-way-rightwards-8", "873.png"),
    new Tile(143, "teleporter-2-way-rightwards-9", "873.png"),
    new Tile(144, "teleporter-2-way-rightwards-10", "873.png"),
    new Tile(145, "teleporter-2-way-downwards-1", "873.png", [], 1, 1, 90),
    new Tile(146, "teleporter-2-way-downwards-2", "873.png", [], 1, 1, 90),
    new Tile(147, "teleporter-2-way-downwards-3", "873.png", [], 1, 1, 90),
    new Tile(148, "teleporter-2-way-downwards-4", "873.png", [], 1, 1, 90),
    new Tile(149, "teleporter-2-way-downwards-5", "873.png", [], 1, 1, 90),
    new Tile(150, "teleporter-2-way-downwards-6", "873.png", [], 1, 1, 90),
    new Tile(151, "teleporter-2-way-downwards-7", "873.png", [], 1, 1, 90),
    new Tile(152, "teleporter-2-way-downwards-8", "873.png", [], 1, 1, 90),
    new Tile(153, "teleporter-2-way-downwards-9", "873.png", [], 1, 1, 90),
    new Tile(154, "teleporter-2-way-downwards-10", "873.png", [], 1, 1, 90),
    new Tile(155, "teleporter-2-way-leftwards-1", "873.png", [], 1, 1, 180),
    new Tile(156, "teleporter-2-way-leftwards-2", "873.png", [], 1, 1, 180),
    new Tile(157, "teleporter-2-way-leftwards-3", "873.png", [], 1, 1, 180),
    new Tile(158, "teleporter-2-way-leftwards-4", "873.png", [], 1, 1, 180),
    new Tile(159, "teleporter-2-way-leftwards-5", "873.png", [], 1, 1, 180),
    new Tile(160, "teleporter-2-way-leftwards-6", "873.png", [], 1, 1, 180),
    new Tile(161, "teleporter-2-way-leftwards-7", "873.png", [], 1, 1, 180),
    new Tile(162, "teleporter-2-way-leftwards-8", "873.png", [], 1, 1, 180),
    new Tile(163, "teleporter-2-way-leftwards-9", "873.png", [], 1, 1, 180),
    new Tile(164, "teleporter-2-way-leftwards-10", "873.png", [], 1, 1, 180),
    new Tile(165, "teleporter-entrance-upwards-1", "873.png", ["914.png"], 1, 1, 270),
    new Tile(166, "teleporter-entrance-upwards-2", "873.png", ["914.png"], 1, 1, 270),
    new Tile(167, "teleporter-entrance-upwards-3", "873.png", ["914.png"], 1, 1, 270),
    new Tile(168, "teleporter-entrance-upwards-4", "873.png", ["914.png"], 1, 1, 270),
    new Tile(169, "teleporter-entrance-upwards-5", "873.png", ["914.png"], 1, 1, 270),
    new Tile(170, "teleporter-entrance-upwards-6", "873.png", ["914.png"], 1, 1, 270),
    new Tile(171, "teleporter-entrance-upwards-7", "873.png", ["914.png"], 1, 1, 270),
    new Tile(172, "teleporter-entrance-upwards-8", "873.png", ["914.png"], 1, 1, 270),
    new Tile(173, "teleporter-entrance-upwards-9", "873.png", ["914.png"], 1, 1, 270),
    new Tile(174, "teleporter-entrance-upwards-10", "873.png", ["914.png"], 1, 1, 270),
    new Tile(175, "teleporter-entrance-rightwards-1", "873.png", ["914.png"]),
    new Tile(176, "teleporter-entrance-rightwards-2", "873.png", ["914.png"]),
    new Tile(177, "teleporter-entrance-rightwards-3", "873.png", ["914.png"]),
    new Tile(178, "teleporter-entrance-rightwards-4", "873.png", ["914.png"]),
    new Tile(179, "teleporter-entrance-rightwards-5", "873.png", ["914.png"]),
    new Tile(180, "teleporter-entrance-rightwards-6", "873.png", ["914.png"]),
    new Tile(181, "teleporter-entrance-rightwards-7", "873.png", ["914.png"]),
    new Tile(182, "teleporter-entrance-rightwards-8", "873.png", ["914.png"]),
    new Tile(183, "teleporter-entrance-rightwards-9", "873.png", ["914.png"]),
    new Tile(184, "teleporter-entrance-rightwards-10", "873.png", ["914.png"]),
    new Tile(185, "teleporter-entrance-downwards-1", "873.png", ["914.png"], 1, 1, 90),
    new Tile(186, "teleporter-entrance-downwards-2", "873.png", ["914.png"], 1, 1, 90),
    new Tile(187, "teleporter-entrance-downwards-3", "873.png", ["914.png"], 1, 1, 90),
    new Tile(188, "teleporter-entrance-downwards-4", "873.png", ["914.png"], 1, 1, 90),
    new Tile(189, "teleporter-entrance-downwards-5", "873.png", ["914.png"], 1, 1, 90),
    new Tile(190, "teleporter-entrance-downwards-6", "873.png", ["914.png"], 1, 1, 90),
    new Tile(191, "teleporter-entrance-downwards-7", "873.png", ["914.png"], 1, 1, 90),
    new Tile(192, "teleporter-entrance-downwards-8", "873.png", ["914.png"], 1, 1, 90),
    new Tile(193, "teleporter-entrance-downwards-9", "873.png", ["914.png"], 1, 1, 90),
    new Tile(194, "teleporter-entrance-downwards-10", "873.png", ["914.png"], 1, 1, 90),
    new Tile(195, "teleporter-entrance-leftwards-1", "873.png", ["914.png"], 1, 1, 180),
    new Tile(196, "teleporter-entrance-leftwards-2", "873.png", ["914.png"], 1, 1, 180),
    new Tile(197, "teleporter-entrance-leftwards-3", "873.png", ["914.png"], 1, 1, 180),
    new Tile(198, "teleporter-entrance-leftwards-4", "873.png", ["914.png"], 1, 1, 180),
    new Tile(199, "teleporter-entrance-leftwards-5", "873.png", ["914.png"], 1, 1, 180),
    new Tile(200, "teleporter-entrance-leftwards-6", "873.png", ["914.png"], 1, 1, 180),
    new Tile(201, "teleporter-entrance-leftwards-7", "873.png", ["914.png"], 1, 1, 180),
    new Tile(202, "teleporter-entrance-leftwards-8", "873.png", ["914.png"], 1, 1, 180),
    new Tile(203, "teleporter-entrance-leftwards-9", "873.png", ["914.png"], 1, 1, 180),
    new Tile(204, "teleporter-entrance-leftwards-10", "873.png", ["914.png"], 1, 1, 180),
    new Tile(205, "teleporter-exit-upwards-1", "873.png", ["906.png"], 1, 1, 270),
    new Tile(206, "teleporter-exit-upwards-2", "873.png", ["906.png"], 1, 1, 270),
    new Tile(207, "teleporter-exit-upwards-3", "873.png", ["906.png"], 1, 1, 270),
    new Tile(208, "teleporter-exit-upwards-4", "873.png", ["906.png"], 1, 1, 270),
    new Tile(209, "teleporter-exit-upwards-5", "873.png", ["906.png"], 1, 1, 270),
    new Tile(210, "teleporter-exit-upwards-6", "873.png", ["906.png"], 1, 1, 270),
    new Tile(211, "teleporter-exit-upwards-7", "873.png", ["906.png"], 1, 1, 270),
    new Tile(212, "teleporter-exit-upwards-8", "873.png", ["906.png"], 1, 1, 270),
    new Tile(213, "teleporter-exit-upwards-9", "873.png", ["906.png"], 1, 1, 270),
    new Tile(214, "teleporter-exit-upwards-10", "873.png", ["906.png"], 1, 1, 270),
    new Tile(215, "teleporter-exit-rightwards-1", "873.png", ["906.png"]),
    new Tile(216, "teleporter-exit-rightwards-2", "873.png", ["906.png"]),
    new Tile(217, "teleporter-exit-rightwards-3", "873.png", ["906.png"]),
    new Tile(218, "teleporter-exit-rightwards-4", "873.png", ["906.png"]),
    new Tile(219, "teleporter-exit-rightwards-5", "873.png", ["906.png"]),
    new Tile(220, "teleporter-exit-rightwards-6", "873.png", ["906.png"]),
    new Tile(221, "teleporter-exit-rightwards-7", "873.png", ["906.png"]),
    new Tile(222, "teleporter-exit-rightwards-8", "873.png", ["906.png"]),
    new Tile(223, "teleporter-exit-rightwards-9", "873.png", ["906.png"]),
    new Tile(224, "teleporter-exit-rightwards-10", "873.png", ["906.png"]),
    new Tile(225, "teleporter-exit-downwards-1", "873.png", ["906.png"], 1, 1, 90),
    new Tile(226, "teleporter-exit-downwards-2", "873.png", ["906.png"], 1, 1, 90),
    new Tile(227, "teleporter-exit-downwards-3", "873.png", ["906.png"], 1, 1, 90),
    new Tile(228, "teleporter-exit-downwards-4", "873.png", ["906.png"], 1, 1, 90),
    new Tile(229, "teleporter-exit-downwards-5", "873.png", ["906.png"], 1, 1, 90),
    new Tile(230, "teleporter-exit-downwards-6", "873.png", ["906.png"], 1, 1, 90),
    new Tile(231, "teleporter-exit-downwards-7", "873.png", ["906.png"], 1, 1, 90),
    new Tile(232, "teleporter-exit-downwards-8", "873.png", ["906.png"], 1, 1, 90),
    new Tile(233, "teleporter-exit-downwards-9", "873.png", ["906.png"], 1, 1, 90),
    new Tile(234, "teleporter-exit-downwards-10", "873.png", ["906.png"], 1, 1, 90),
    new Tile(235, "teleporter-exit-leftwards-1", "873.png", ["906.png"], 1, 1, 180),
    new Tile(236, "teleporter-exit-leftwards-2", "873.png", ["906.png"], 1, 1, 180),
    new Tile(237, "teleporter-exit-leftwards-3", "873.png", ["906.png"], 1, 1, 180),
    new Tile(238, "teleporter-exit-leftwards-4", "873.png", ["906.png"], 1, 1, 180),
    new Tile(239, "teleporter-exit-leftwards-5", "873.png", ["906.png"], 1, 1, 180),
    new Tile(240, "teleporter-exit-leftwards-6", "873.png", ["906.png"], 1, 1, 180),
    new Tile(241, "teleporter-exit-leftwards-7", "873.png", ["906.png"], 1, 1, 180),
    new Tile(242, "teleporter-exit-leftwards-8", "873.png", ["906.png"], 1, 1, 180),
    new Tile(243, "teleporter-exit-leftwards-9", "873.png", ["906.png"], 1, 1, 180),
    new Tile(244, "teleporter-exit-leftwards-10", "873.png", ["906.png"], 1, 1, 180), // /teleporter 125-244
    new Tile(245, "chain-anchor-upwards", "856.png", [], 1, 1, 270), // moving
    new Tile(246, "chain-anchor-rightwards", "856.png"),
    new Tile(247, "chain-anchor-downwards", "856.png", [], 1, 1, 90),
    new Tile(248, "chain-anchor-leftwards", "856.png", [], 1, 1, 180), // /moving 245-248
    new Tile(249, "missile-launcher-upwards", "844.png"), // hazards
    new Tile(250, "missile-launcher-rightwards", "847.png"),
    new Tile(251, "missile-launcher-downwards", "850.png"),
    new Tile(252, "missile-launcher-leftwards", "853.png"),
    new Tile(253, "gas-pipe-continuous-upwards", "832.png"),
    new Tile(254, "gas-pipe-continuous-rightwards", "832.png", [], 1, 1, 90),
    new Tile(255, "gas-pipe-continuous-downwards", "832.png", [], 1, 1, 180),
    new Tile(256, "gas-pipe-continuous-leftwards", "832.png", [], 1, 1, 270),
    new Tile(257, "gas-pipe-intermittent-start-off-upwards", "832.png"),
    new Tile(258, "gas-pipe-intermittent-start-off-rightwards", "832.png", [], 1, 1, 90),
    new Tile(259, "gas-pipe-intermittent-start-off-downwards", "832.png", [], 1, 1, 180),
    new Tile(260, "gas-pipe-intermittent-start-off-leftwards", "832.png", [], 1, 1, 270),
    new Tile(261, "gas-pipe-intermittent-start-low-upwards", "832.png"),
    new Tile(262, "gas-pipe-intermittent-start-low-rightwards", "832.png", [], 1, 1, 90),
    new Tile(263, "gas-pipe-intermittent-start-low-downwards", "832.png", [], 1, 1, 180),
    new Tile(264, "gas-pipe-intermittent-start-low-leftwards", "832.png", [], 1, 1, 270),
    new Tile(265, "gas-pipe-intermittent-start-high-upwards", "832.png"),
    new Tile(266, "gas-pipe-intermittent-start-high-rightwards", "832.png", [], 1, 1, 90),
    new Tile(267, "gas-pipe-intermittent-start-high-downwards", "832.png", [], 1, 1, 180),
    new Tile(268, "gas-pipe-intermittent-start-high-leftwards", "832.png", [], 1, 1, 270), // /hazards 249-268
    new Tile(269, "enemy-troop-chatting-left-facing", "739.png"), // enemies
    new Tile(270, "enemy-troop-chatting-right-facing", "739.png", [], 1, 1, 0, true),
    new Tile(271, "enemy-troop-crouching-left-facing", "750.png"),
    new Tile(272, "enemy-troop-crouching-right-facing", "750.png", [], 1, 1, 0, true),
    new Tile(273, "enemy-troop-eating", "757.png"), // /enemies 269-273
    new Tile(274, "moving-winch-block", "1113.png"), // moving / 274
    new Tile(275, "blimp-outer-nose-top-left", "1012.png"), // decoration
    new Tile(276, "blimp-inner-nose-top-left", "1015.png"),
    new Tile(277, "blimp-body-to-nose-top-left", "1018.png"),
    new Tile(278, "blimp-body-no-light-top", "1027.png"),
    new Tile(279, "blimp-body-center-top", "1024.png"),
    new Tile(280, "blimp-body-with-light-top", "1021.png"),
    new Tile(281, "blimp-body-to-nose-top-right", "1018.png", [], 1, 1, 0, true),
    new Tile(282, "blimp-inner-nose-top-right", "1015.png", [], 1, 1, 0, true),
    new Tile(283, "blimp-outer-nose-top-right", "1012.png", [], 1, 1, 0, true),
    new Tile(284, "blimp-outer-nose-bottom-left", "1012.png", [], 1, 1, 0, false, true),
    new Tile(285, "blimp-inner-nose-bottom-left", "1015.png", [], 1, 1, 0, false, true),
    new Tile(286, "blimp-body-to-nose-bottom-left", "1018.png", [], 1, 1, 0, false, true),
    new Tile(287, "blimp-body-no-light-bottom", "1027.png", [], 1, 1, 0, false, true),
    new Tile(288, "blimp-body-center-bottom", "1024.png", [], 1, 1, 0, false, true),
    new Tile(289, "blimp-body-with-light-bottom", "1021.png", [], 1, 1, 0, false, true),
    new Tile(290, "blimp-body-to-nose-bottom-right", "1018.png", [], 1, 1, 0, true, true),
    new Tile(291, "blimp-inner-nose-bottom-right", "1015.png", [], 1, 1, 0, true, true),
    new Tile(292, "blimp-outer-nose-bottom-right", "1012.png", [], 1, 1, 0, true, true),
    new Tile(293, "pipe-se-steam-small-puff-up-left", "509.png"),
    new Tile(294, "pipe-sw-steam-small-puff-up", "512.png"),
    new Tile(295, "pipe-ne-steam-large-puff-down-left", "515.png"),
    new Tile(296, "pipe-nw-steam-large-puff-right", "518.png"),
    new Tile(297, "pipe-generator-1-small-stream-up-right-small-puff-up", "536.png"),
    new Tile(298, "pipe-generator-2-med-stream-down", "539.png"),
    new Tile(299, "pipe-se-steam-tiny-small-puff-stream-left", "509.png"),
    new Tile(300, "pipe-sw-steam-med-sporadic-puffs-up", "512.png"),
    new Tile(301, "pipe-ne-steam-tiny-long-medium-stream-down-left", "515.png"),
    new Tile(302, "pipe-nw-steam-tiny-small-stream-down-right", "518.png"),
    new Tile(303, "pipe-generator-1-small-puffs-all-over", "536.png"),
    new Tile(304, "pipe-generator-2-sporadic-stream-down", "539.png"),
    new Tile(305, "steampunk-cylinder-top-left-outer", "1083.png"),
    new Tile(306, "steampunk-cylinder-top-left-inner", "1086.png"),
    new Tile(307, "steampunk-cylinder-top-right-inner", "1086.png", [], 1, 1, 0, true),
    new Tile(308, "steampunk-cylinder-top-right-outer", "1083.png", [], 1, 1, 0, true),
    new Tile(309, "steampunk-cylinder-mid-left-outer", "1093.png"),
    new Tile(310, "steampunk-cylinder-mid-left-inner", "1096.png"),
    new Tile(311, "steampunk-cylinder-mid-right-inner", "1096.png", [], 1, 1, 0, true),
    new Tile(312, "steampunk-cylinder-mid-right-outer", "1093.png", [], 1, 1, 0, true),
    new Tile(313, "steampunk-cylinder-bottom-left-outer", "1103.png"),
    new Tile(314, "steampunk-cylinder-bottom-left-inner", "1106.png"),
    new Tile(315, "steampunk-cylinder-bottom-right-inner", "1106.png", [], 1, 1, 0, true),
    new Tile(316, "steampunk-cylinder-bottom-right-outer", "1103.png", [], 1, 1, 0, true), // /decoration 275-316
    new Tile(317, "enemy-gas-craft-ew-1", "1148.png"), // enemies
    new Tile(318, "enemy-gas-craft-ew-2", "1148.png"),
    new Tile(319, "enemy-gas-craft-ns-1", "1148.png"),
    new Tile(320, "enemy-gas-craft-ns-2", "1148.png"),
    new Tile(321, "enemy-gas-craft-static", "1148.png"),
    new Tile(322, "Enemy-tank-ew-1", "1135.png"),
    new Tile(323, "Enemy-tank-ew-2", "1135.png"), // /enemies 317-323
    new Tile(324, "ally-cage", "1126.png", ["1129.png"]), // other / 324
    new Tile(325, "enemy-bomb-craft-static", "1178.png"), // enemies
    new Tile(326, "enemy-bomb-craft-ew-1", "1178.png"),
    new Tile(327, "enemy-bomb-craft-ew-2", "1178.png"),
    new Tile(328, "enemy-bomb-craft-ns-1", "1178.png"),
    new Tile(329, "enemy-bomb-craft-ns-2", "1178.png"), // /enemies 325-329
    new Tile(330, "tea-health-collectable", "1217.png"), // other
    new Tile(331, "medal-collectable", "1205.png"),
    new Tile(332, "opened-cage", "1129.png"), // /other 330-332
    new Tile(333, "EXIT", "303.png"), // tools / 333
    new Tile(334, "already-descended-elevator", "299.png"), // other / 334
    new Tile(335, "walker-tank-ew-1", "1259.png"), // enemies
    new Tile(336, "walker-tank-ew-2", "1259.png"),
    new Tile(337, "walker-tank-static", "1259.png"),
    new Tile(338, "enemy-tank-facing-left-ew-1", "1135.png"),
    new Tile(339, "enemy-tank-facing-left-ew-2", "1135.png"),
    new Tile(340, "enemy-tank-facing-right-ew-1", "1135.png", [], 1, 1, 0, true),
    new Tile(341, "enemy-tank-facing-right-ew-2", "1135.png", [], 1, 1, 0, true),
    new Tile(342, "barron-boss-mid-battle", "1309.png"),
    new Tile(343, "barron-boss-final-battle", "1309.png"), // /enemies 335-343
    new Tile(344, "queen-victoria", "1349.png"), // other / 344
    new Tile(345, "partially-armored-center-armor-nw", "1358.png"), // basic
    new Tile(346, "partially-armored-center-armor-ne", "1361.png"),
    new Tile(347, "partially-armored-center-armor-w", "1364.png"),
    new Tile(348, "partially-armored-center-armor-n", "1367.png"),
    new Tile(349, "partially-armored-center-armor-s", "1370.png"),
    new Tile(350, "partially-armored-center-armor-sw", "1373.png"),
    new Tile(351, "partially-armored-center-armor-se", "1376.png"),
    new Tile(352, "partially-armored-center-armor-e", "1379.png"), // /basic 345-352
  ]
}

function getTileLibrary() {
  return tileLibrary
}
module.exports = {
  Tile, getTileLibrary, buildTileLibrary
}