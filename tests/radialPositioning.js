const test = require('tape')

import RadialTimeSelector from './../dist/RadialTimeSelector';


test('== radial positioning == ', function(t){
  t.test('- 200 radius, 4 points -', function(ts){

    // circle radius = 200 && options = 4
    var expectedResult = [
      { x: 0, y: 200 },
      { x: 200, y: 0 },
      { x: 0, y: -200 },
      { x: -200, y: -0 }
    ]
  
    let selector = new RadialTimeSelector()
    var testResult = selector.pointsOnRadius(4, 200)
  
    // check each result
    expectedResult.forEach(( expectedVector, index )=>{
      ts.equal( testResult[index].x, expectedVector.x);
      ts.equal( testResult[index].y, expectedVector.y);
    })
    
    ts.end()
  
  })
  
  t.test('- 200 radius, 5 points -', function(ts){
  
    // circle radius = 200 && options = 4
    var expectedResult = [
      { x: 0, y: 200 },
      { x: 190, y: 62 },
      { x: 118, y: -162 },
      { x: -118, y: -162 },
      { x: -190, y: 62 }
    ]
  
    let selector = new RadialTimeSelector()
    var testResult = selector.pointsOnRadius(5, 200)
  
    // check each result
    expectedResult.forEach(( expectedVector, index )=>{
      ts.equal( testResult[index].x, expectedVector.x);
      ts.equal( testResult[index].y, expectedVector.y);
    })
    
    ts.end()
  
  })

  t.test('- 400 radius, 4 points -', function(ts){

    // circle radius = 200 && options = 4
    var expectedResult = [
      { x: 0, y: 400 },
      { x: 400, y: 0 },
      { x: 0, y: -400 },
      { x: -400, y: -0 }
    ]
  
    let selector = new RadialTimeSelector()
    var testResult = selector.pointsOnRadius(4, 400)
  
    // check each result
    expectedResult.forEach(( expectedVector, index )=>{
      ts.equal( testResult[index].x, expectedVector.x);
      ts.equal( testResult[index].y, expectedVector.y);
    })
    
    ts.end()
  
  })
})

test('== change reference from circle middle to top left ==', function(t){
  t.test('- 220 from top left, 200 radius, 4 points -', (ts)=>{
    
    // point distribution for 4 points on a 200 radius circle
    var pointsOnRadius = [
      { x: 0, y: 200 },
      { x: 200, y: 0 },
      { x: 0, y: -200 },
      { x: -200, y: -0 }
    ];

    var expectedResult = [
      { x: 220, y: 20 },
      { x: 420, y: 220 },
      { x: 220, y: 420 },
      { x: 20, y: 220 }
    ]

    let selector = new RadialTimeSelector();
    var testResult = selector.centerRefToTopLeftRef(pointsOnRadius, {x:220, y:220});

    // check each result
    expectedResult.forEach(( expectedVector, index )=>{
      ts.equal( testResult[index].x, expectedVector.x);
      ts.equal( testResult[index].y, expectedVector.y);
    })
    
    ts.end()
  })


})



