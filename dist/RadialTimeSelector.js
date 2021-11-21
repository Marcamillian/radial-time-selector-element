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
    this.value = null;
  }

  connectedCallback(){
    let shadowRoot = this.attachShadow({mode:'open'})

    // clone the template
    let instance = this.template.content.cloneNode(true)
    shadowRoot.appendChild(instance)

    // get relevant internal elements
    this.dialInner = shadowRoot.querySelector('.dial-inner');
    this.dialOuter = shadowRoot.querySelector('.dial-outer');

    this.addClockNumbers();
  }

  getHTMLTemplate(){
    const template = document.createElement('template');
    template.innerHTML = `
      <style>
        radial-time-selector{
          color:red;
        }

        .radial-selector .dial-inner{
          fill:#FF5722;
        }
        .radial-selector .dial-outer{
          fill:#8BC34A;
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
   
    const centerLineRadius = this.getPlacementRadius();
    const tlToCenter = this.getVectorToCenter();

    const optionPositions = this.getOptionPositions(optionCount, centerLineRadius, tlToCenter);

    optionPositions.forEach((position)=>{
      let circleElement = document.createElementNS("http://www.w3.org/2000/svg","circle")
      circleElement.setAttribute('cx', position.x);
      circleElement.setAttribute('cy', position.y);
      circleElement.setAttribute('r', 2);
      svg.appendChild(circleElement);
    })
  }

  addClockNumbers(){
    let numbers = [...Array(12).keys()];
    numbers = numbers.slice(1, numbers.length);
    numbers.unshift(12);

    const svg = this.shadowRoot.querySelector('svg');

    const centerLineRadius = this.getPlacementRadius();
    const tlToCenter = this.getVectorToCenter();
    const optionPositions = this.getOptionPositions(numbers.length,centerLineRadius, tlToCenter)

    optionPositions.forEach( (position, key)=>{
      let textLabel = document.createElementNS("http://www.w3.org/2000/svg","text")
      textLabel.classList.add('option')
      textLabel.setAttribute('x', position.x)
      textLabel.setAttribute('y', position.y)
      textLabel.setAttribute('text-anchor', 'middle')
      textLabel.setAttribute('dominant-baseline', 'central')
      textLabel.setAttribute('data-value',  numbers[key])
      textLabel.addEventListener('mouseup', this.optionClicked.bind(this))
      textLabel.innerHTML = numbers[key];
      svg.appendChild(textLabel)
    })
  }

  getPlacementRadius(){
    const svg = this.shadowRoot.querySelector('svg');
    const outerCircle = svg.querySelector('.dial-outer');
    const innerCircle =  svg.querySelector('.dial-inner');

    const outerRadius = parseInt(outerCircle.getAttribute("r"));
    const innerRadius = parseInt(innerCircle.getAttribute("r"));    
    return innerRadius + (outerRadius - innerRadius)/2;
  }

  getVectorToCenter(){
    const svg = this.shadowRoot.querySelector('svg');
    const outerCircle = svg.querySelector('.dial-outer');

    return{
      x: parseInt(outerCircle.getAttribute("cx")),
      y: parseInt(outerCircle.getAttribute("cy"))
    };
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

  optionClicked(event){
    this.clearSelection();

    const optionElement = event.target;
    optionElement.classList.add('selected')
    this.value = parseInt(optionElement.dataset.value);
  }

  clearSelection(){
    let options = this.querySelectorAll('svg .option')
    options.forEach( element =>{
      element.classList.remove('selected');
    })

  }

}

