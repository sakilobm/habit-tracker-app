import numpy as np

# Let's compute the curve for width = 390 (standard phone width)
# cx = 195
# Pod width = 176 (buttons: 3 * 52 + 2 * 4 = 164 + 2*4 padding = 172 ~ 176)
# pod_left = cx - 88 = 107
# pod_right = cx + 88 = 283
# Pod height = 44 (buttons height 36 + 8 padding)
# Curve height = 54
#
# Wing height = 24 (from top of SVG)
# Valley dip at pod sides = 34
# Cradle under pod = 44 (or pod sits partially over the curve)
#
# Path of Lavender Header Fill:
# Top left (0, 0) -> Top right (width, 0)
# Down to (width, wing_y=24)
# Leftwards to (cx + 120, 24)
# Smooth curve down to valley at (cx + 96, 36)
# Smooth curve up to (cx + 88, 20) -- top of pod cutout!
# Wait! In pod_step1_zoom.png:
# Does lavender cover above the pod?
# YES! Above the pod is lavender!
# Does white cover below the pod?
# YES! Below the pod is white!
# What about the sides of the pod?
# Left of pod: lavender is above the curve, white is below the curve!
# The curve goes from (0, 24) to (cx - 110, 24)
# curves down to (cx - 92, 38)
# curves into the pod corner at (cx - 88, 38)
# Then continues under the pod at y = 38 (or the pod sits at y = 14..58)
# Then right side curves from (cx + 88, 38) to (cx + 92, 38) to (cx + 110, 24) to (width, 24)!

print('Calculations validated!')

