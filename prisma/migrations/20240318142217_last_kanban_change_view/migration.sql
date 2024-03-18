-- CreateView
CREATE VIEW `LastKanbanUpdate` AS
    SELECT kanbanId, MAX(timestamp) AS lastChange
    FROM TrackChanges 
    GROUP BY kanbanId;
