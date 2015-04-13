export function collision(rect1, rect2) {

  const playerX = rect2.x + rect2.width;

  if(playerX > rect1.x && playerX < rect1.x + rect1.width) {
    const playerY = rect2.y + rect2.height;
    return playerY > rect1.y && playerY < rect1.y + rect1.height;
  }

  return false;
}

export function checkCollisions(rects, player) {

  var m = rects.map(function(rect) {
    return collision(rect, player);
  });

  return m.indexOf(true) > -1;
}
