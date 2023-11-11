const db = require("../models/index");
const { uploadImage, uploadVideo } = require("../middlewares/multer");

exports.addCourse = async (req, res) => {
  try {
    uploadImage.single("course_image")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Image upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const {
        course_title,
        course_description,
        course_price,
        course_rate,
        course_length,
        object_1,
        object_2,
        object_3,
        object_4,
        object_5,
        object_6,
        object_7,
        object_8,
        requirement_1,
        requirement_2,
        requirement_3,
        requirement_4,
        requirement_5,
        requirement_6,
        requirement_7,
        requirement_8,
      } = req.body;

      const course_image = req.file.path; // Path to the uploaded image
      const trainer_id = req.params.trainer_id;

      // Check if the trainer exists
      const trainer = await db.trainers.findByPk(trainer_id);
      if (!trainer) {
        return res.status(404).json({ error: "Trainer not found" });
      }

      // Create a new course
      const newCourse = await db.courses.create({
        course_title,
        course_description,
        course_price,
        course_rate,
        course_length,
        course_image,
        trainer_id,
      });

      // Create entries in course_objects
      const courseObjects = await db.course_objects.create({
        course_id: newCourse.course_id,
        object_1,
        object_2,
        object_3,
        object_4,
        object_5,
        object_6,
        object_7,
        object_8,
        is_deleted: false,
      });

      // Create entries in course_requirements
      const courseRequirements = await db.course_requirements.create({
        course_id: newCourse.course_id,
        requirement_1,
        requirement_2,
        requirement_3,
        requirement_4,
        requirement_5,
        requirement_6,
        requirement_7,
        requirement_8,
        is_deleted: false,
      });

      res.status(201).json({
        message: "Course and related data added successfully",
        course_id: newCourse.course_id,
      });
    });
  } catch (error) {
    console.error("Failed to add the course: ", error);
    return res.status(500).json({ error: "Failed to add the course" });
  }
};

exports.addCourseSection = async (req, res) => {
  try {
    const { section_name } = req.body;
    const course_id = req.params.course_id;

    const course = await db.courses.findByPk(course_id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const newCourseSection = await db.course_sections.create({
      section_name,
      course_id: course.course_id,
      is_deleted: false,
    });

    res.status(201).json({
      message: "Course section added successfully",
      course_section_id: newCourseSection.course_section_id,
    });
  } catch (error) {
    console.error("Failed to add the course section: ", error);
    return res.status(500).json({ error: "Failed to add the course section" });
  }
};

exports.addCourseVideos = async (req, res) => {
  try {
    uploadVideo.single("video_link")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Video upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
      }

      const { video_title } = req.body;
      const video_link = req.file.path;
      const course_section_id = req.params.course_section_id;

      const courseSection = await db.course_sections.findByPk(
        course_section_id
      );
      if (!courseSection || courseSection.is_deleted) {
        return res.status(404).json({ error: "Course section not found" });
      }

      const newSectionVideo = await db.section_videos.create({
        video_title,
        video_link,
        course_section_id: courseSection.course_section_id,
        is_deleted: false,
      });

      res.status(201).json({
        message: "Course video added successfully",
        video_id: newSectionVideo.video_id,
      });
    });
  } catch (error) {
    console.error("Failed to add the course video: ", error);
    return res.status(500).json({ error: "Failed to add the course video" });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;
    const {
      course_title,
      course_description,
      course_price,
      course_rate,
      course_length,
      object_1,
      object_2,
      object_3,
      object_4,
      object_5,
      object_6,
      object_7,
      object_8,
      requirement_1,
      requirement_2,
      requirement_3,
      requirement_4,
      requirement_5,
      requirement_6,
      requirement_7,
      requirement_8,
    } = req.body;

    const course = await db.courses.findByPk(course_id);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const updatedCourse = await course.update({
      course_title,
      course_description,
      course_price,
      course_rate,
      course_length,
    });

    // Manually update associated models
    const updatedCourseObjects = await db.course_objects.update(
      {
        object_1,
        object_2,
        object_3,
        object_4,
        object_5,
        object_6,
        object_7,
        object_8,
      },
      { where: { course_id: updatedCourse.course_id } }
    );

    const updatedCourseRequirements = await db.course_requirements.update(
      {
        requirement_1,
        requirement_2,
        requirement_3,
        requirement_4,
        requirement_5,
        requirement_6,
        requirement_7,
        requirement_8,
      },
      { where: { course_id: updatedCourse.course_id } }
    );

    res.status(200).json({
      message: "Course updated successfully",
      course_id: updatedCourse.course_id,
    });
  } catch (error) {
    console.error("Failed to update the course: ", error);
    return res.status(500).json({ error: "Failed to update the course" });
  }
};

exports.updateCourseSection = async (req, res) => {
  try {
    const { section_name } = req.body;
    const course_section_id = req.params.course_section_id;

    const courseSection = await db.course_sections.findByPk(course_section_id);
    if (!courseSection) {
      return res.status(404).json({ error: "Course section not found" });
    }

    await courseSection.update({
      section_name,
    });

    res.status(200).json({
      message: "Course section updated successfully",
    });
  } catch (error) {
    console.error("Failed to update the course section: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update the course section" });
  }
};

exports.updateCourseVideos = async (req, res) => {
  try {
    uploadVideo.single("video_link")(req, res, async function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Video upload failed" });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No video uploaded" });
      }

      const { video_title } = req.body;
      const video_link = req.file.path;
      const video_id = req.params.video_id;

      const sectionVideo = await db.section_videos.findByPk(video_id);
      if (!sectionVideo || sectionVideo.is_deleted) {
        return res.status(404).json({ error: "Section video not found" });
      }

      await sectionVideo.update({
        video_title,
        video_link,
      });

      res.status(200).json({
        message: "Section video updated successfully",
      });
    });
  } catch (error) {
    console.error("Failed to update the section video: ", error);
    return res
      .status(500)
      .json({ error: "Failed to update the section video" });
  }
};

// controllers/coursesController.js

exports.deleteCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;

    const course = await db.courses.findByPk(course_id, {
      include: [
        {
          model: db.course_objects,
          where: { is_deleted: false },
        },
        {
          model: db.course_requirements,
          where: { is_deleted: false },
        },
        {
          model: db.course_sections,
          where: { is_deleted: false },
          include: [
            {
              model: db.section_videos,
              where: { is_deleted: false },
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    await Promise.all([
      course.update({ is_deleted: true }),
      db.course_objects.update(
        { is_deleted: true },
        { where: { course_id: course.course_id } }
      ),
      db.course_requirements.update(
        { is_deleted: true },
        { where: { course_id: course.course_id } }
      ),
      db.course_sections.update(
        { is_deleted: true },
        { where: { course_id: course.course_id } }
      ),
      db.section_videos.update(
        { is_deleted: true },
        { where: { course_section_id: course.course_id } }
      ),
    ]);

    res.status(200).json({
      message:
        "Course and associated objects, requirements, sections, and videos soft-deleted successfully",
      course_id: course.course_id,
    });
  } catch (error) {
    console.error("Failed to delete the course: ", error);
    return res.status(500).json({ error: "Failed to delete the course" });
  }
};

exports.deleteCourseSection = async (req, res) => {
  try {
    const course_section_id = req.params.course_section_id;

    const courseSection = await db.course_sections.findByPk(course_section_id);
    if (!courseSection) {
      return res.status(404).json({ error: "Course section not found" });
    }

    await courseSection.update({
      is_deleted: true,
    });

    // Soft delete associated videos
    await db.section_videos.update(
      { is_deleted: true },
      { where: { course_section_id } }
    );

    res.status(200).json({
      message: "Course section deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete the course section: ", error);
    return res
      .status(500)
      .json({ error: "Failed to delete the course section" });
  }
};

exports.deleteCourseVideos = async (req, res) => {
  try {
    const video_id = req.params.video_id;

    const sectionVideo = await db.section_videos.findByPk(video_id);
    if (!sectionVideo) {
      return res.status(404).json({ error: "Section video not found" });
    }

    await sectionVideo.update({
      is_deleted: true,
    });

    res.status(200).json({
      message: "Section video deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete the section video: ", error);
    return res
      .status(500)
      .json({ error: "Failed to delete the section video" });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course_id = req.params.course_id;

    const course = await db.courses.findByPk(course_id, {
      include: [
        {
          model: db.courses, 
        },
        {
          model: db.course_requirements,
          where: { is_deleted: false }, 
        },
        {
          model: db.course_objects,
          where: { is_deleted: false }, 
        },
        {
          model: db.course_sections,
          where: { is_deleted: false }, 
          include: [
            {
              model: db.section_videos,
              where: { is_deleted: false },
            },
          ],
        },
      ],
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.status(200).json({
      message: "Course details retrieved successfully",
      course,
    });
  } catch (error) {
    console.error("Failed to retrieve course details: ", error);
    return res.status(500).json({ error: "Failed to retrieve course details" });
  }
};
