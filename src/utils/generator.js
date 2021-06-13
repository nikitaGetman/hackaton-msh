export function generateSquares({ startCoords, matrixSize, sideLength }) {
  const squares = []

  for (let i = 0; i < matrixSize; i += 1) {
    squares[i] = []
    for (let j = 0; j < matrixSize; j += 1) {
      const squareStartPoint = [startCoords[0] - (sideLength * i) / 2, startCoords[1] + sideLength * j]
      const squareEndPoint = [squareStartPoint[0] - sideLength / 2, squareStartPoint[1] + sideLength]
      const coords = [squareStartPoint, squareEndPoint]
      const weight = Math.random() * 10
      squares[i][j] = {
        coords,
        weight
      }
    }
  }

  return squares
}
export function generatePoints({ startCoords, endCoords, count }) {
  const points = []
  const maxLat = endCoords[0] - startCoords[0]
  const maxLong = endCoords[1] - startCoords[1]

  for (let i = 0; i < count; i += 1) {
    const lat = Math.random() * maxLat + startCoords[0]
    const long = Math.random() * maxLong + startCoords[1]
    points.push([lat, long])
  }

  return points
}

export function generateRectangles(squares) {
  const rects = []
  const defaultOptions = {
    fillOpacity: 0.2,
    strokeWidth: 0
  }
  for (let i = 0; i < squares.length; i += 1) {
    const rowLength = squares[i].length
    for (let j = 0; j < rowLength; j += 1) {
      const weight = squares[i][j].weight * 10

      const colors = {
        worst: '#c21a0c',
        bad: '#f78c03',
        normal: '#f8e004',
        good: '#bed701',
        best: '#68c621'
      }
      let color = colors.worst
      if (weight >= 2 && weight < 4) color = colors.bad
      if (weight >= 4 && weight < 6) color = colors.normal
      if (weight >= 6 && weight < 8) color = colors.good
      if (weight >= 8) color = colors.best

      rects[j + i * rowLength] = {
        id: squares[i][j].id,
        coords: squares[i][j].coords,
        options: { ...defaultOptions, fillColor: color }
      }
    }
  }

  return rects
}

export function generateRectanglesBackend(squares) {
  const rects = []
  const defaultOptions = {
    fillOpacity: 0.2,
    strokeWidth: 0
  }
  for (let i = 0; i < squares.length; i += 1) {
    const weight = squares[i].weight * 10

    const colors = {
      worst: '#c21a0c',
      bad: '#f78c03',
      normal: '#f8e004',
      good: '#bed701',
      best: '#68c621'
    }
    let color = colors.worst
    if (weight >= 2 && weight < 4) color = colors.bad
    if (weight >= 4 && weight < 6) color = colors.normal
    if (weight >= 6 && weight < 8) color = colors.good
    if (weight >= 8) color = colors.best

    rects[i] = {
      id: squares[i].id,
      coords: squares[i].coords,
      options: { ...defaultOptions, fillColor: color }
    }
  }

  return rects
}

export function generateObjects(rects) {
  const objects = {
    type: 'FeatureCollection',
    features: []
  }

  for (let i = 0; i < rects.length; i += 1) {
    objects.features.push({
      type: 'Feature',
      id: rects[i].id,
      geometry: {
        type: 'Rectangle',
        coordinates: rects[i].coords
      },
      properties: rects[i].properties,
      options: rects[i].options
    })
  }

  return objects
}

export function generateMarkers(points) {
  const markers = {
    type: 'FeatureCollection',
    features: []
  }
  for (let i = 0; i < points.length; i += 1) {
    markers.features.push({
      type: 'Feature',
      id: i,
      geometry: { type: 'Point', coordinates: points[i] }
    })
  }
  return markers
}
