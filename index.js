let engine = Matter.Engine.create();
let borders = [
    Matter.Bodies.rectangle(size.w/2, size.h, size.w*2, 50, {isStatic: true}),
    Matter.Bodies.rectangle(size.w/22, 0, size.w*2, 50, {isStatic: true}),
    Matter.Bodies.rectangle(size.w, size.h/2, 50, size.h*2, {isStatic: true}),
    Matter.Bodies.rectangle(0, size.h/2, 50, size.h*2, {isStatic: true})
];
let stairs = [
    Matter.Bodies.rectangle(size.w - 725, size.h - 75, 200, 100, {isStatic: true}),
    Matter.Bodies.rectangle(size.w - 525, size.h - 125, 200, 200, {isStatic: true}),
    Matter.Bodies.rectangle(size.w - 225, size.h - 175, 400, 300, {isStatic: true}),
];

let world = engine.world;

let render = Matter.Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: size.w,
        height: size.h,
        showAngleIndicator: false
    }
});

Matter.Render.run(render);

let population = new Population(100);
console.log("GENERATION: " + population.generation);
let druidIndex = 0;
let druid = population.druids[druidIndex];
reset(druid);
setInterval(() => {
    druidIndex++;
    if (druidIndex >= population.druids.length - 1) {
        console.log("AVERAGE SCORE: " + average(population.scores.map(s => Math.floor(s)).filter(v => v !== 25)));
        console.log("MAX SCORE: " + Math.max(...population.scores.map(s => Math.floor(s))));
        druidIndex = 0;
        population.repopulate();
        console.log("=====================================");
        console.log("CURRENT GENERATION: " + population.generation);
        console.log("=====================================");
    }
    druid = population.druids[druidIndex];
    reset(druid);
}, 3000);

function reset(druid) {
    Matter.World.clear(world);
    Matter.World.add(world, borders);
    Matter.World.add(world, stairs);
    Matter.World.add(world, druid.body);
    for (let i = 0; i < druid.arms.length; i++) {
        Matter.World.add(world, [druid.arms[i].chain, druid.arms[i].constraint]);
    }
}

function tick() {
    for (let i = 0; i < druid.arms.length; i++) {
        for (let j = 0; j < druid.arms[i].chain.bodies.length; j++) {
            Matter.Body.setAngularVelocity(druid.arms[i].chain.bodies[j], druid.arms[i].angularVelocities[j]);
        }
    }
    Matter.Body.setAngularVelocity(druid.body, 0);
    population.updateScores();
    Matter.Engine.update(engine, 10);
    // requestAnimationFrame(tick);
}
// tick();
setInterval(tick, 1);