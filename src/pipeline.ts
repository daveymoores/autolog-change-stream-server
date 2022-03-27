const pipeline = [
  {
    $match: {
      $or: [
        {
          operationType: "update",
          $or: [
            {
              "updateDescription.updatedFields.user_signature": {
                $exists: 1,
              },
            },
            {
              "updateDescription.updatedFields.approver_signature": {
                $exists: 1,
              },
            },
          ],
        },
      ],
    },
  },
];

const options = { fullDocument: "updateLookup" };

export { options, pipeline };
