import Certificate from '../models/Certificate.js';

export const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ student: req.user._id, status: 'active' })
      .populate('course', 'title category level thumbnail instructor')
      .sort('-issuedAt');
    res.json({ success: true, data: { certificates: certs } });
  } catch (error) {
    next(error);
  }
};

export const verifyCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findOne({ certificateId: req.params.certificateId })
      .populate('student', 'name username')
      .populate('course', 'title category level instructor');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: { certificate: cert } });
  } catch (error) {
    next(error);
  }
};

export const adminRevokeCertificate = async (req, res, next) => {
  try {
    const cert = await Certificate.findByIdAndUpdate(
      req.params.id,
      { status: 'revoked', revokedAt: new Date(), revokedReason: req.body.reason || '' },
      { new: true }
    );
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });
    res.json({ success: true, data: { certificate: cert } });
  } catch (error) {
    next(error);
  }
};

export const adminGetCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find()
      .populate('student', 'name email username')
      .populate('course', 'title')
      .sort('-issuedAt');
    res.json({ success: true, data: { certificates: certs } });
  } catch (error) {
    next(error);
  }
};
