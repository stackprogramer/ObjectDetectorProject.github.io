imDir = fullfile('car');
addpath(imDir);
for i=1:1:3567
 img =['nocar/1 (',num2str(i),').jpg'];
 I = imread(img);
 J= imresize(I,[256 256]);
 imwrite(J,img);

end
