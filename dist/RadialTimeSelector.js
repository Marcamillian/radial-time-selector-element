if(!typeof HTMLElement === "undefined"){
  class HTMLElement{
    constructor(){
      
    }
  }
}

export default class RadialTimeSelector extends HTMLElement{
  constructor(){
    super();

    // internal state variables
    if(typeof document != "undefined"){
      this.template = this.getHTMLTemplate();
    }

    this.options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
    this.dialInner = null;
    this.dialOuter = null;
  }

  connectedCallback(){
    let shadowRoot = this.attachShadow({mode:'open'})

    // clone the template
    let instance = this.template.content.cloneNode(true)
    shadowRoot.appendChild(instance)

    // get relevant internal elements
    this.dialInner = shadowRoot.querySelector('.dial-inner');
    this.dialOuter = shadowRoot.querySelector('.dial-outer');
  }

  getHTMLTemplate(){
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        radial-time-selector{
          color:red;
        }

        .radial-selector .dial-outer{
          fill:red;
        }
        .radial-selector .dial-inner{
          fill:blue;
        }
        .radial-selector{
          height:300px;
          width:300px;
        }
      </style>

      <div>
        <svg class="radial-selector" viewBox="0 0 100 100">
            <circle class="dial-outer" cx="50" cy="50" r="45"></circle>
            <circle class="dial-inner" cx="50" cy="50" r="25"></circle>
        </svg>
      </div>
    `
    return template;
  }

  getMaxDim(){
    // get the height and width of the containing element
    const boundingRect = this.getBoundingClientRect();
    const maxDimJs = Math.max(boundingRect.width, boundingRect.height)
    const maxDimCss = Math.max(this.style.height, this.style.width);

    return{
      'javascript' : maxDimJs,
      'css' : maxDimCss
    }
  }

  addOptionDots(optionCount){

    const svg = this.shadowRoot.querySelector('svg');
    const outerCircle = svg.querySelector('.dial-outer');
    const innerCircle =  svg.querySelector('.dial-inner');

    const outerRadius = parseInt(outerCircle.getAttribute("r"));
    const innerRadius = parseInt(innerCircle.getAttribute("r"));    
    const centerLineRadius = innerRadius + (outerRadius - innerRadius)/2;
    // get the vector between top left and center of circle
    const tlToCenter = {
      x: parseInt(outerCircle.getAttribute("cx")),
      y: parseInt(outerCircle.getAttribute("cy"))
    };

    const optionPositions = this.getOptionPositions(optionCount, centerLineRadius, tlToCenter);

    optionPositions.forEach((position)=>{
      let circleElement = document.createElementNS("http://www.w3.org/2000/svg","circle")
      circleElement.setAttribute('cx', position.x);
      circleElement.setAttribute('cy', position.y);
      circleElement.setAttribute('r', 2);
      svg.appendChild(circleElement);
    })
  }


  getOptionPositions( optionCount, radiusCenterline, leftToCenterVector ){
    const positionsFromCenter = this.pointsOnRadius(optionCount, radiusCenterline);
    const positionsFromTopLeft = this.centerRefToTopLeftRef(positionsFromCenter, leftToCenterVector);

    return positionsFromTopLeft;
  }

  pointsOnRadius( pointCount, radius ){
    
    const radianSpacing = (2*Math.PI)/pointCount;

    let currentArc = 0;
    let positions = [];

    for (var i=0; i < pointCount; i++){
      positions.push({
        x: Math.round(radius * Math.sin( currentArc )),
        y: Math.round(radius * Math.cos( currentArc )),
        angle: (Math.PI * currentArc)*180
      })
      currentArc += radianSpacing;
    }

    return positions;
  }

  centerRefToTopLeftRef( pointsArray, leftToCenterVector = { x:0, y:0 }){
    return pointsArray.map( pointVector =>{
      return {
        x: leftToCenterVector.x + pointVector.x,
        y: leftToCenterVector.y - pointVector.y
      }
    })
  }


}

