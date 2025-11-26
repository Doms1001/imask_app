// backend/controllers/uploadController.js
const supabase = require('../supabase');

const BUCKET = 'department_images';

// POST /api/department-image
// expects: multipart/form-data with fields { department, screen, slot, file }
exports.uploadDepartmentImage = async (req, res) => {
  try {
    const { department, screen, slot } = req.body;

    if (!department || !screen || !slot) {
      return res.status(400).json({ ok: false, message: 'department, screen and slot are required' });
    }

    if (!req.file) {
      return res.status(400).json({ ok: false, message: 'no file uploaded' });
    }

    const original = req.file.originalname || 'image.jpg';
    const ext = original.includes('.') ? original.split('.').pop() : 'jpg';

    const path = `${department}/${screen}/${slot}_${Date.now()}.${ext}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true, // overwrite if same path
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return res.status(500).json({ ok: false, message: 'storage upload failed', error: uploadError.message });
    }

    // Public URL
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(path);
    const publicUrl = publicData?.publicUrl;

    // Save / update DB row
    const { data: row, error: dbError } = await supabase
      .from('department_media')
      .upsert(
        {
          department,
          screen,
          slot,
          image_path: path,
        },
        {
          onConflict: 'department,screen,slot',
        }
      )
      .select()
      .single();

    if (dbError) {
      console.error('DB upsert error:', dbError);
    }

    return res.json({
      ok: true,
      path,
      publicUrl,
      record: row,
    });
  } catch (err) {
    console.error('uploadDepartmentImage error:', err);
    res.status(500).json({ ok: false, message: 'unexpected error', error: err.message });
  }
};

// GET /api/department-media?department=CCS&screen=CCSF5
exports.getDepartmentMedia = async (req, res) => {
  try {
    const { department, screen } = req.query;

    if (!department) {
      return res.status(400).json({ ok: false, message: 'department is required' });
    }

    let query = supabase
      .from('department_media')
      .select('*')
      .eq('department', department);

    if (screen) {
      query = query.eq('screen', screen);
    }

    const { data, error } = await query;

    if (error) {
      console.error('DB select error:', error);
      return res.status(500).json({ ok: false, message: 'failed to fetch media', error: error.message });
    }

    const items = (data || []).map((row) => {
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(row.image_path);
      return {
        ...row,
        publicUrl: urlData?.publicUrl || null,
      };
    });

    res.json({ ok: true, items });
  } catch (err) {
    console.error('getDepartmentMedia error:', err);
    res.status(500).json({ ok: false, message: 'unexpected error', error: err.message });
  }
};
