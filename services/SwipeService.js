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
}