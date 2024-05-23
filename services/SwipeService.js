module.exports = {

    onJobSwipeLeft: async (user,jobId) => {
        if (!user.swipedJobs.left.includes(jobId)) {
            user.swipedJobs.left.push(jobId);
            await user.save();
        }
    },
    onJobSwipeRight: async (user,jobId) => {
        if (!user.swipedJobs.right.includes(jobId)) {
            user.swipedJobs.right.push(jobId);
            await user.save();
        }
    },

    onEmployerSwipeLeft: async (user,userId) => {
        if (!user.swipedUsers.left.includes(userId)) {
            user.swipedUsers.left.push(userId);
            await user.save();
        }
    },

    onEmployerSwipeRight: async (user,userId) => {
        if (!user.swipedUsers.right.includes(userId)) {
            user.swipedUsers.right.push(userId);
            await user.save();
        }
    }
}