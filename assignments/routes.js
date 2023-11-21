import db from "../Database/index.js";

function findAssignmentIndexById(aid) {
    return db.assignments.findIndex((a) => a._id === aid);
}

async function AssignmentRoutes(app) {
    app.put("/api/assignments/:aid", async (req, res) => {
        const { aid } = req.params;
        const assignmentIndex = findAssignmentIndexById(aid);

        if (assignmentIndex !== -1) {
            db.assignments[assignmentIndex] = {
                ...db.assignments[assignmentIndex],
                ...req.body,
            };
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    });

    app.get("/api/assignments/:aid", async (req, res) => {
        const { aid } = req.params;
        const assignmentIndex = findAssignmentIndexById(aid);

        if (assignmentIndex !== -1) {
            res.send(db.assignments[assignmentIndex]);
        } else {
            res.sendStatus(404);
        }
    });

    app.delete("/api/assignments/:aid", async (req, res) => {
        const { aid } = req.params;
        const assignmentIndex = findAssignmentIndexById(aid);

        if (assignmentIndex !== -1) {
            db.assignments.splice(assignmentIndex, 1);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    });

    app.post("/api/courses/:cid/assignments", async (req, res) => {
        const { cid } = req.params;
        const newAssignment = {
            ...req.body,
            course: cid,
            _id: new Date().getTime().toString(),
        };
        db.assignments.push(newAssignment);
        res.status(201).send(newAssignment);
    });

    app.get("/api/courses/:cid/assignments", async (req, res) => {
        const { cid } = req.params;
        const assignments = db.assignments.filter((m) => m.course === cid);
        res.send(assignments);
    });
}

export default AssignmentRoutes;
