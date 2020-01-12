const MAX_ARMS = 3, MAX_SPEED = 0.1;

class Druid {

    constructor(armProperties=null) {
        this.group = Matter.Body.nextGroup(true);
        this.body = this.getStartingBody();
        this.arms = (armProperties === null) ? this.getRandomArms() : this.getArmsFromProps(armProperties);
    }

    getRandomArms() {
        let arms = [];
        let num = randRange(1, MAX_ARMS);
        let length, width, height, offset;

        for (let i = 0; i < num; i++) {
            length = randInt(1, 3);
            width = 15;//randInt(10, 30);
            height = randInt(30, 70);
            offset = {x: randRange(-35, 35), y: randRange(-35, 35)};
            let arm = this.linkArm(length, width, height, offset);
            arms.push(arm);
        }

        return arms;
    }

    linkArm(length, width, height, offset, angVelocities=null) {
        let chain = Matter.Composites.stack(100 + offset.x, 615 + offset.y, length, 1, 10, 10, (x, y) => {
            return Matter.Bodies.rectangle(x, y, height, width, { collisionFilter: { group: this.group } });
        });

        Matter.Composites.chain(chain, 0.5, 0, -0.5, 0, { stiffness: 1, length: 2, render: { type: 'line' } });

        let constraint = Matter.Constraint.create({
            bodyA: this.body,
            pointA: { x: offset.x, y: offset.y},
            bodyB: chain.bodies[0],
            pointB: { x: -height/2, y: 0 }
        });

        let angularVelocities;
        if (angVelocities === null) {
            angularVelocities = [];
            for (let i = 0; i < chain.bodies.length; i++) {
                angularVelocities.push(randRange(-MAX_SPEED, MAX_SPEED))
            }
        } else {
            angularVelocities = angVelocities
        }

        return {chain, constraint, angularVelocities, properties: {length, width, height, offset, angularVelocities}};
    }

    getStartingBody() {
        return Matter.Bodies.circle(100, 625, 50, { collisionFilter: {group: this.group} });
    }

    setPosition(x, y) {
        Matter.Body.setPosition(this.body, Matter.Vector.create(x, y));
    }

    getArmsFromProps(propertiesArr) {
        let arms = [];
        for (let props of propertiesArr) {
            let arm = this.linkArm(props.length, props.width, props.height, props.offset, props.angularVelocities);
            arms.push(arm);
        }
        return arms
    }

    getScore() {
        return Math.pow(this.body.position.x/20, 2);
    }

    static breed(parent1, parent2) {
        let armProps = parent1.arms.concat(parent2.arms).map(a => a.properties);
        let num = randInt(1, Math.min(armProps.length, MAX_ARMS));
        let selectedProps = selectRandomN(armProps, num);

        for (let i = 0; i < selectedProps.length; i++) {
            if (probability(1/30)) {
                switch (randInt(1, 4)) {
                    case 1:
                        let currLength = selectedProps[i].length;
                        selectedProps[i].length = randInt(1, 3);
                        for (let j = 0; j < selectedProps[i].length - currLength; j++) {
                            selectedProps[i].angularVelocities.push(randRange(-MAX_SPEED, MAX_SPEED))
                        }
                        break;
                    case 2:
                        selectedProps[i].height = randInt(30, 70);
                        break;
                    case 3:
                        selectedProps[i].offset = {x: randRange(-35, 35), y: randRange(-35, 35)};
                        break;
                    case 4:
                        let angularVelocities = [];
                        for (let j = 0; j < selectedProps[i].angularVelocities.length; j++) {
                            angularVelocities.push(randRange(-MAX_SPEED, MAX_SPEED))
                        }
                        selectedProps[i].angularVelocities = angularVelocities;
                        break;
                }
            }
        }
        return new Druid(selectedProps);
    }
}